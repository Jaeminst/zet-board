'use client';
import { useCallback, useEffect, useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { EditableField } from '@/components/ui/editable-field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PlusSquare, MinusSquare, CheckCircle2, XCircle } from 'lucide-react';
import { useDatabaseSetting } from '@/contexts/DatabaseSettingContext';
import { useProfileSession } from '@/contexts/ProfileSessionContext';
import IpcRenderer from '@/lib/ipcRenderer';
import { toast } from 'sonner';

type ExpandedClusters = {
  [key: string]: boolean;
};

// 모든 "건강한" 상태를 포함하는 배열
const healthyStates: DatabaseStates[] = [
  'available',
  'backing-up',
  'configuring-enhanced-monitoring',
  'configuring-iam-database-auth',
  'configuring-log-exports',
  'converting-to-vpc',
  'maintenance',
  'migrating',
  'modifying',
  'storage-config-upgrade',
  'storage-optimization',
  'upgrading',
];

// 상태 검사 함수
function isDatabaseHealthy(status: string): status is DatabaseStates {
  return healthyStates.includes(status as DatabaseStates);
}

// 클러스터 행을 렌더링하는 컴포넌트
const DatabaseTableRow = ({ database, isExpanded, toggleExpand }: { database: Database, isExpanded: boolean, toggleExpand: (identifier: string) => void }) => {
  const [profileSession] = useProfileSession();
  const [databaseSettingList, setDatabaseSettingList] = useDatabaseSetting();

  const updateDatabaseField = useCallback((endpoint: Endpoint, field: keyof DatabaseSetting[string], value: string | boolean) => {
    if (!endpoint.Address) return;
    const updatedSettings = { ...databaseSettingList };
    if (!updatedSettings[endpoint.Address]) {
      updatedSettings[endpoint.Address] = {};
    }
    if (field === 'tunneling') {
      updatedSettings[endpoint.Address].tunneling = value as boolean;
    } else {
      updatedSettings[endpoint.Address][field] = value as string;
    }
    setDatabaseSettingList(updatedSettings);
    if (field === 'tunneling') {
      const tunnelingData = {
        type: 'database',
        localPort: updatedSettings[endpoint.Address].localPort,
        address: endpoint.Address,
        port: endpoint.Port,
        tunneling: value,
      }
      console.log('tunneling data', tunnelingData)
      IpcRenderer.tunneling(tunnelingData as TunnelingData, profileSession as string, (status) => {
        if (status.tunneling) {
          toast.success(`Tunneling ${updatedSettings[endpoint.Address as string].alias}`);
        }
      });
    }
  }, [profileSession, databaseSettingList, setDatabaseSettingList]);

  return (
    <>
      <TableRow key={database.Identifier}>
        <TableCell className='w-[80px] h-[50px] px-4 pt-1 pb-1'>
          <Switch
            checked={database.Endpoint.Address ? databaseSettingList?.[database.Endpoint.Address]?.tunneling ?? false : false}
            onCheckedChange={(checked) => updateDatabaseField(database.Endpoint, 'tunneling', checked)}
          />
        </TableCell>
        <TableCell className='w-[30px] h-[49px] p-0 pl-[7px] text-slate-500'>
          {database.Role == 'Cluster'
            ? (isExpanded
              ? <button onClick={() => toggleExpand(database.Identifier)}>
                  <MinusSquare className="h-5 w-5" />
                </button>
              : <button onClick={() => toggleExpand(database.Identifier)}>
                  <PlusSquare className="h-5 w-5" />
                </button>
              )
            : <></>
          }
        </TableCell>
        <TableCell className='w-[80px] p-1'>
          <EditableField
            label="Alias"
            value={database.Endpoint.Address ? databaseSettingList?.[database.Endpoint.Address]?.alias ?? '' : ''}
            onSave={(newValue) => updateDatabaseField(database.Endpoint, 'alias', newValue)}
          />
        </TableCell>
        <TableCell className='w-[80px] p-1'>
          <EditableField
            label="LocalPort"
            value={database.Endpoint.Address ? databaseSettingList?.[database.Endpoint.Address]?.localPort ?? '' : ''}
            onSave={(newValue) => updateDatabaseField(database.Endpoint, 'localPort', newValue)}
          />
        </TableCell>
        <TableCell className='w-[250px] p-1'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => copyToClipboard(`${database.Endpoint.Address}:${database.Endpoint.Port}`)}
                  className="w-full h-10 p-0 pl-1.5 pr-1.5 justify-start"
                  variant="ghost"
                >
                  {database.Identifier}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to endpoint</p>
                <p>{`${database.Endpoint.Address}:${database.Endpoint.Port}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className='w-[80px] p-1 whitespace-nowrap pl-[18px]'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {isDatabaseHealthy(database.Status)
                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                : <XCircle className="h-5 w-5 text-gray-400" />
                }
              </TooltipTrigger>
              <TooltipContent>
                <p>{database.Status}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className='w-[120px] p-1 whitespace-nowrap'>{database.Role}</TableCell>
        <TableCell className='w-[120px] p-1 whitespace-nowrap'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p>{database.Engine}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{database.EngineVersion}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell className='w-[120px] p-1 whitespace-nowrap'>
          {database.Role == 'Cluster'
            ? `${database.Size} 인스턴스`
            : database.Size
          }
        </TableCell>
      </TableRow>
      {database.Role == 'Cluster' && isExpanded && (
        <InstanceRows
          instances={database.Instances}
          updateDatabaseField={updateDatabaseField}
        />
      )}
    </>
  );
};

// 클러스터와 연결된 인스턴스들을 렌더링하는 컴포넌트
const InstanceRows = ({ instances, updateDatabaseField }: { instances: Database[], updateDatabaseField: (endpoint: Endpoint, field: keyof DatabaseSetting[string], value: string | boolean) => void }) => {
  const [databaseSettingList] = useDatabaseSetting();

  return (
    <>
      {instances.map(instance => (
        <TableRow key={instance.Identifier}>
          <TableCell className='w-[80px] h-[50px] px-4 pt-1 pb-1'>
            <Switch
              checked={instance.Endpoint.Address ? databaseSettingList?.[instance.Endpoint.Address]?.tunneling ?? false : false}
              onCheckedChange={(checked) => updateDatabaseField(instance.Endpoint, 'tunneling', checked)}
            />
          </TableCell>
          <TableCell className='relative w-[30px] h-[49px] p-0'>
            <div className="absolute w-full h-full top-0">
              <svg className='w-full h-full overflow-visible pointer-events-none'>
                {instance.Role === 'Cluster-RO'
                  ? <line x1='17' y1='-19' x2='17' y2='25' stroke='rgb(170, 183, 184)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
                  : <line x1='17' y1='-25' x2='17' y2='25' stroke='rgb(170, 183, 184)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
                }
                <line x1='17' y1='25' x2='80' y2='25' stroke='rgb(170, 183, 184)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
              </svg>
            </div>
          </TableCell>
          <TableCell className='w-[80px] p-1'>
          </TableCell>
          <TableCell className='w-[80px] p-1'>
            <EditableField
              label="LocalPort"
              value={instance.Endpoint.Address ? databaseSettingList?.[instance.Endpoint.Address]?.localPort ?? '' : ''}
              onSave={(newValue) => updateDatabaseField(instance.Endpoint, 'localPort', newValue)}
            />
          </TableCell>
          <TableCell className='w-[250px] p-1'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={() => copyToClipboard(`${instance.Endpoint.Address}:${instance.Endpoint.Port}`)}
                    className="w-full h-10 p-0 pl-1.5 pr-1.5 justify-start"
                    variant="ghost"
                  >
                    {instance.Identifier}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to endpoint</p>
                  <p>{`${instance.Endpoint.Address}:${instance.Endpoint.Port}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className='w-[80px] p-1 whitespace-nowrap pl-[18px]'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {instance.Role !== 'Cluster-RO'
                    ? (isDatabaseHealthy(instance.Status)
                      ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                      : <XCircle className="h-5 w-5 text-gray-400" />
                      )
                    : <></>
                  }
                </TooltipTrigger>
                <TooltipContent>
                  <p>{instance.Status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className='w-[120px] p-1 whitespace-nowrap'>{instance.Role}</TableCell>
          <TableCell className='w-[120px] p-1 whitespace-nowrap'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p>{instance.Engine}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{instance.EngineVersion}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          <TableCell className='w-[120px] p-1 whitespace-nowrap'>{instance.Size}</TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default function DatabaseTable({ databases }: { databases: Database[] }) {
  const [expandedClusters, setExpandedClusters] = useState<ExpandedClusters>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // 'Cluster' 역할을 가진 데이터베이스만 초기 확장 상태 오브젝트에 포함시킵니다.
  useEffect(() => {
    const initialStates = databases.reduce((states, db) => {
      if (db.Role === 'Cluster') {
        states[db.Identifier] = false; // Initially, clusters are not expanded
      }
      return states;
    }, {} as ExpandedClusters);
    setExpandedClusters(initialStates);
    setAllExpanded(false); // Initially, not all clusters are expanded
  }, [databases]);

  const toggleExpand = (identifier: string) => {
    setExpandedClusters(exp => {
      const newExpanded = { ...exp, [identifier]: !exp[identifier] };
      // Check if all or none are expanded after this toggle
      const allExpanded = Object.values(newExpanded).every(exp => exp);
      const noneExpanded = Object.values(newExpanded).every(exp => !exp);

      // 'Cluster' 역할을 가진 데이터베이스가 모두 확장되거나 모두 축소된 경우 allExpanded 상태를 업데이트합니다.
      if (allExpanded || noneExpanded) {
        setAllExpanded(allExpanded);
      }

      return newExpanded;
    });
  };

  const toggleAllClusters = () => {
    setAllExpanded(!allExpanded);
    setExpandedClusters(prevState =>
      Object.keys(prevState).reduce((acc, key) => {
        // 현재 상태와 반대되는 값을 설정합니다.
        acc[key] = !allExpanded;
        return acc;
      }, {} as ExpandedClusters)
    );
  };

  return (
    <Table className='border shadow-sm rounded-lg p-6'>
      <TableHeader>
        <TableRow>
          <TableHead>Tunnel</TableHead>
          <TableHead className='p-2 pt-4'>
            <button onClick={toggleAllClusters}>
              {allExpanded ? <MinusSquare className="h-5 w-5" /> : <PlusSquare className="h-5 w-5" />}
            </button>
          </TableHead>
          <TableHead>Alias</TableHead>
          <TableHead>LocalPort</TableHead>
          <TableHead>Identifier</TableHead>
          <TableHead className='pl-2.5'>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Engine</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(databases) && databases.map((database) => (
          <DatabaseTableRow
            key={database.Identifier}
            database={database}
            isExpanded={expandedClusters[database.Identifier]}
            toggleExpand={() => toggleExpand(database.Identifier)}
          />
        ))}
      </TableBody>
    </Table>
  );
}
