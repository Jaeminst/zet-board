'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownIcon, FileEditIcon, TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileList {
  idx: number;
  environment: string;
  accountId: string;
  selectRole: string;
  roles: [string];
}

export default function UsersTable({ profiles }: { profiles: ProfileList[] }) {
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});

  const handleSelectRole = (idx: number, role: string): void => {
    setSelectedRoles(prev => ({ ...prev, [idx]: role }));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/4">Environment</TableHead>
          <TableHead className="w-1/4">AWS Account ID</TableHead>
          <TableHead className="w-1/4">Role</TableHead>
          <TableHead className="w-1/4 text-right">Actions</TableHead>
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
                    {selectedRoles[profile.idx] || profile.selectRole || "Select Role"}
                    <ArrowDownIcon className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {profile.roles.sort((a, b) => a.localeCompare(b)).map((role) => (
                    <DropdownMenuItem key={role} onClick={() => handleSelectRole(profile.idx, role)}>{role}</DropdownMenuItem>
                  ))}
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
