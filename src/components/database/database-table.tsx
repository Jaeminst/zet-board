'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import EditableField from '@/components/EditableField';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useDatabaseSearch } from '@/contexts/DatabaseSearchContext';

export default function DatabaseTable({ databases }: { databases: DatabaseList[] }) {
  const [databaseList, setDatabaseList] = useDatabase();
  const [databaseSearchList, setDatabaseSearchList] = useDatabaseSearch();
  const [selectedEnvironment] = useEnvironment();

  useEffect(() => {
    setDatabaseSearchList(databaseList);
  }, [databaseList, setDatabaseSearchList]);

  const updateDatabaseField = (idx: number, field: keyof DatabaseSetting, value: string) => {
    const updatedList = databaseList.map((database) => {
      if (database.idx === idx) {
        return { ...database, [field]: value };
      }
      return database;
    });
    setDatabaseList(updatedList);
    localStorage.setItem(`databaseList_${selectedEnvironment}`, JSON.stringify(updatedList));
    localStorage.setItem(`databaseSetting_${selectedEnvironment}`, JSON.stringify(updatedList));
  };

  const toggleSwitch = (idx: number) => {
    const updatedList = databaseList.map(database => {
      if (database.idx === idx) {
        return { ...database, tunneling: !database.tunneling };
      }
      return database;
    });
    setDatabaseList(updatedList);
    localStorage.setItem(`databaseList_${selectedEnvironment}`, JSON.stringify(updatedList));
    localStorage.setItem(`databaseSetting_${selectedEnvironment}`, JSON.stringify(updatedList));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard", {
        description: text,
        duration: 2000
      })
    } catch (err) {
      alert(`Failed to copy: ${err}`);
    }
  };

  return (
    <Table className='border shadow-sm rounded-lg p-2'>
      <TableHeader>
        <TableRow>
          <TableHead>Tunneling</TableHead>
          <TableHead>Alias</TableHead>
          <TableHead>LocalPort</TableHead>
          <TableHead>Identifier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Engine</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...databases].sort((a, b) => a.idx - b.idx).map((database) => (
          <TableRow key={database.idx}>
            <TableCell className='w-24'>
              <Switch checked={database.tunneling} onCheckedChange={() => toggleSwitch(database.idx)} />
            </TableCell>
            <TableCell className='w-32 p-1'>
              <EditableField
                label="Alias"
                value={database.alias}
                onSave={(newValue) => updateDatabaseField(database.idx, 'alias', newValue)}
              />
            </TableCell>
            <TableCell className='w-20 p-1'>
              <EditableField
                label="LocalPort"
                value={database.localport}
                onSave={(newValue) => updateDatabaseField(database.idx, 'localport', newValue)}
              />
            </TableCell>
            <TableCell className='w-48 p-1'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      onClick={() => copyToClipboard(database.endpoint)}
                      className="w-full h-10 bg-white text-black p-0 pl-1.5 justify-start"
                      variant="ghost"
                    >
                      {database.identifier}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy to endpoint</p>
                    <p>{database.endpoint}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className='w-16'>{database.status}</TableCell>
            <TableCell className='w-32'>{database.role}</TableCell>
            <TableCell className='w-32'>{database.engine}</TableCell>
            <TableCell className='w-32'>{database.size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
