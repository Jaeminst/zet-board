'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useDatabase } from '@/contexts/DatabaseContext';

export default function DatabaseTable({ databases }: { databases: Database[] }) {
  const [databaseList, setDatabaseList] = useDatabase();

  const toggleSwitch = (idx: number) => {
    const updatedList = databaseList.map(database => {
      if (database.idx === idx) {
        return { ...database, tunneling: !database.tunneling };
      }
      return database;
    });
    setDatabaseList(updatedList);
    localStorage.setItem("databaseList", JSON.stringify(updatedList));
  };

  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
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
            <TableCell>
              <Switch checked={database.tunneling} onCheckedChange={() => toggleSwitch(database.idx)} />
            </TableCell>
            <TableCell>{database.alias}</TableCell>
            <TableCell>{database.localport}</TableCell>
            <TableCell>{database.identifier}</TableCell>
            <TableCell>{database.status}</TableCell>
            <TableCell>{database.role}</TableCell>
            <TableCell>{database.engine}</TableCell>
            <TableCell>{database.size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
