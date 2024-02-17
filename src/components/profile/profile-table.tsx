'use client';
import { useProfile } from '@/contexts/ProfileContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { EditProfile } from './edit-profile';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export default function ProfileTable({ profiles }: { profiles: Profile[] }) {
  const [profileList, setProfileList] = useProfile();
  const [selectedEnvironment, setSelectedEnvironment] = useEnvironment();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});

  const handleSelectRole = (idx: number, role: string): void => {
    setSelectedRoles(prev => ({ ...prev, [idx]: role }));
  };

  const handleDeleteProfile = (idx: number) => {
    const profileToDelete = profileList.find(profile => profile.idx === idx);
    if (profileToDelete && profileToDelete.environment === selectedEnvironment) {
      setSelectedEnvironment('Select Profile');
    };
    setProfileList(profileList.filter(profile => profile.idx !== idx));
  };

  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">Environment</TableHead>
          <TableHead className="w-64 pl-8" >Role</TableHead>
          <TableHead className="w-64">Account ID</TableHead>
          <TableHead className="w-1 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...profiles].sort((a, b) => a.idx - b.idx).map((profile) => (
          <TableRow key={profile.idx}>
            <TableCell>{profile.environment}</TableCell>
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
            <TableCell>{profile.accountId}</TableCell>
            <TableCell className="flex flex-row justify-center">
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
