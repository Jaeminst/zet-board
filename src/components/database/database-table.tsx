'use client';
import { useEffect, useState } from 'react';
import { copyToClipboard } from '@/lib/clipboard';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { EditableField } from '@/components/ui/editable-field';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useProfileSession } from '@/contexts/ProfileSessionContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useDatabaseSetting } from '@/contexts/DatabaseSettingContext';
import { useDatabaseSearch } from '@/contexts/DatabaseSearchContext';
import React from 'react';
import { PlusSquare, MinusSquare, CheckCircle2, XCircle } from 'lucide-react';

const dummySettings = [
  {
    tunneling: false,
    alias: "",
    localport: 0,
    identifier: "string",
  }
]

const updateDatabaseField = (identifier: string, field: keyof DatabaseSetting, value: string) => {
  // const updatedList = databaseList.map((database) => {
  //   if (database.identifier === identifier) {
  //     return { ...database, [field]: value };
  //   }
  //   return database;
  // });
  // setDatabaseList(updatedList);
};

const toggleSwitch = (identifier: string) => {
  // const updatedList = databaseList.map(database => {
  //   if (database.identifier === identifier) {
  //     return { ...database, tunneling: !database.tunneling };
  //   }
  //   return database;
  // });
  // setDatabaseList(updatedList);
};

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
const DatabaseTableRow = ({ database, isAllExpanded }: { database: Database, isAllExpanded: boolean }) => {
  const [expandedClusters, setExpandedClusters] = useState<ExpandedClusters>({});

  const toggleExpand = (identifier: string) => {
    setExpandedClusters(exp => ({
      ...exp,
      [identifier]: !exp[identifier]
    }));
  };

  useEffect(() => {
    setExpandedClusters({ [database.Identifier]: isAllExpanded });
  }, [isAllExpanded, database.Identifier]);

  return (
    <>
      <TableRow key={database.Identifier}>
        <TableCell className='w-[80px] h-[50px] px-4 pt-1 pb-1'>
          <Switch checked={database.tunneling} onCheckedChange={() => toggleSwitch(database.Identifier)} />
        </TableCell>
        <TableCell className='w-[30px] h-[49px] p-0 pl-[7px] text-slate-500'>
          {database.Role == 'Cluster'
            ? (expandedClusters[database.Identifier]
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
            value={"alias"}
            onSave={(newValue) => updateDatabaseField(database.Identifier, 'alias', newValue)}
          />
        </TableCell>
        <TableCell className='w-[80px] p-1'>
          <EditableField
            label="LocalPort"
            value={"localport"}
            onSave={(newValue) => updateDatabaseField(database.Identifier, 'localport', newValue)}
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
          {isDatabaseHealthy(database.Status)
          ? <CheckCircle2 className="h-5 w-5 text-green-600" />
          : <XCircle className="h-5 w-5 text-gray-400" />
          }
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
      {database.Role == 'Cluster' && expandedClusters[database.Identifier] && (
        <InstanceRows instances={database.Instances} />
      )}
    </>
  );
};

// 클러스터와 연결된 인스턴스들을 렌더링하는 컴포넌트
const InstanceRows = ({ instances }: { instances: Database[] }) => {
  return (
    <>
      {instances.map(instance => (
        <TableRow key={instance.Identifier}>
          <TableCell className='w-[80px] h-[50px] px-4 pt-1 pb-1'>
            <Switch checked={instance.tunneling} onCheckedChange={() => toggleSwitch(instance.Identifier)} />
          </TableCell>
          <TableCell className='relative w-[30px] h-[49px] p-0'>
            <div className="absolute w-full h-full top-0">
              <svg className='w-full h-full overflow-visible pointer-events-none'>
                <line x1='17' y1='-25' x2='17' y2='25' stroke='rgb(170, 183, 184)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
                <line x1='17' y1='25' x2='80' y2='25' stroke='rgb(170, 183, 184)' strokeWidth='2' vectorEffect='non-scaling-stroke' />
              </svg>
            </div>
          </TableCell>
          <TableCell className='w-[80px] p-1'>
          </TableCell>
          <TableCell className='w-[80px] p-1'>
            <EditableField
              label="LocalPort"
              value={"localport"}
              onSave={(newValue) => updateDatabaseField(instance.Identifier, 'localport', newValue)}
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
            {instance.Role !== 'Cluster-RO'
              ? (isDatabaseHealthy(instance.Status)
                ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                : <XCircle className="h-5 w-5 text-gray-400" />
                )
              : <></>
            }
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
  const [databaseList, setDatabaseList] = useDatabase();
  const [databaseSettingList, setDatabaseSettingList] = useDatabaseSetting();
  const [databaseSearchList, setDatabaseSearchList] = useDatabaseSearch();
  const [profileSession] = useProfileSession();
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleAllClusters = () => {
    setIsAllExpanded(!isAllExpanded);
  };

  // tunneling: boolean;
  // alias: string,
  // localport: string;
  // identifier: string;
  useEffect(() => {
    setDatabaseSearchList(databaseList);
  }, [databaseList, setDatabaseSearchList]);

  return (
    <Table className='border shadow-sm rounded-lg p-6'>
      <TableHeader>
        <TableRow>
          <TableHead>Tunnel</TableHead>
          <TableHead className='p-2 pt-4'>
            <button onClick={toggleAllClusters}>
              {isAllExpanded ? <MinusSquare className="h-5 w-5" /> : <PlusSquare className="h-5 w-5" />}
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
            isAllExpanded={isAllExpanded}
          />
        ))}
      </TableBody>
    </Table>
  );
}
