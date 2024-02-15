'use client';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { EditProfile } from './edit-profile';

interface ProfileList {
  idx: number;
  environment: string;
  accessKey: string;
  secretKey: string;
  accountId: string;
  selectRole: string;
  roles: string[];
}

export default function ProfileTable({ profiles }: { profiles: ProfileList[] }) {
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
          <TableHead className="w-1/4 pl-8" >Role</TableHead>
          <TableHead className="w-1/6 pr-8 text-right">Actions</TableHead>
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
              <EditProfile idx={profile.idx} profile={profile} />
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
