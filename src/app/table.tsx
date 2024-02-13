'use client';
import { useProfile } from '@/components/ProfileContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDownIcon, FileEditIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function UsersTable() {
  const [profileList, setProfileList] = useProfile();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});

  const handleSelectRole = (idx: number, role: string): void => {
    setSelectedRoles(prev => ({ ...prev, [idx]: role }));
  };

  const handleDeleteProfile = (idx: number) => {
    setProfileList(profileList.filter(profile => profile.idx !== idx));
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
        {profileList.map((profile) => (
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
              <Button size="icon" variant="ghost" onClick={() => handleDeleteProfile(profile.idx)}>
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
