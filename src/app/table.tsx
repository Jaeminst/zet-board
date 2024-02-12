import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Text
} from '@tremor/react';
import { ArrowDownIcon, FileEditIcon, TrashIcon } from 'lucide-react';

interface Profile {
  idx: number;
  environment: string;
  accountId: string;
  role: string;
}

export default function UsersTable({ profiles }: { profiles: Profile[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Environment</TableHead>
          <TableHead>AWS Account ID</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.idx}>
            <TableCell>{profile.environment}</TableCell>
            <TableCell>{profile.accountId}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-expanded="true" variant="ghost">
                    {profile.role}
                    <ArrowDownIcon className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Administrator</DropdownMenuItem>
                  <DropdownMenuItem>Developer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell className="text-right">
              <Button size="icon" variant="ghost">
                <FileEditIcon className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button size="icon" variant="ghost">
                <TrashIcon className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
