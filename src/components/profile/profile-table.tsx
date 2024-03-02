'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useProfileSession } from '@/contexts/ProfileSessionContext';
import { EditProfile } from './edit-profile';
import { ipcParser } from '@/lib/ipcParser';
import { Loading } from '@/components/ui/loading';

export default function ProfileTable({ profiles }: { profiles: Profile[] }) {
  const [profileList, setProfileList] = useProfile();
  const [profileSession, setProfileSession] = useProfileSession();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});

  const handleSelectRole = (selectProfile: Profile, role: string): void => {
    setSelectedRoles(prev => ({ ...prev, [selectProfile.idx]: role }));
    // profileList 상태에서 idx 값이 일치하는 프로필을 찾아 그의 역할을 업데이트합니다.
    setProfileList(prevProfileList => prevProfileList.map(profile => 
      profile.idx === selectProfile.idx ? { ...profile, selectRole: role } : profile
    ));
  };

  const handleDeleteProfile = (idx: number) => {
    const profileToDelete = profileList.find(profile => profile.idx === idx);
    if (profileToDelete) {
      window.electron.profile.send('delete-profile', profileToDelete.profileName);
      window.electron.profile.once('delete-profile', (deleteProfileString: string) => {
        ipcParser(deleteProfileString);
        setProfileList(profileList.filter(profile => profile.idx !== idx));
      });
      if (profileToDelete.profileName === profileSession) {
        setProfileSession('Select Profile');
      }
    }
  };

  const swapProfileIdxUp = (selectedIdx: number) => {
    setProfileList(currentList => {
      const newList = [...currentList];
      const selectedProfile = newList.find(p => p.idx === selectedIdx);
      const aboveProfile = newList.find(p => p.idx === selectedIdx - 1);
      if (selectedProfile && aboveProfile) {
        selectedProfile.idx -= 1;
        aboveProfile.idx += 1;
      }
      return newList;
    });
  };
  
  const swapProfileIdxDown = (selectedIdx: number) => {
    setProfileList(currentList => {
      const newList = [...currentList];
      const selectedProfile = newList.find(p => p.idx === selectedIdx);
      const belowProfile = newList.find(p => p.idx === selectedIdx + 1);
      if (selectedProfile && belowProfile) {
        selectedProfile.idx += 1;
        belowProfile.idx -= 1;
      }
      return newList;
    });
  };

  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-40">Profile</TableHead>
          <TableHead className="w-64 pl-8" >Role</TableHead>
          <TableHead className="w-64">Account ID</TableHead>
          <TableHead className="w-1 text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(profileList) && [...profiles].sort((a, b) => a.idx - b.idx).map((profile) => (
          <TableRow key={profile.idx}>
            <TableCell>{profile.profileName}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-expanded="true" variant="ghost">
                    {selectedRoles[profile.idx] || profile.selectRole || "Select Role"}
                  </Button>
                </DropdownMenuTrigger>
                {profile.roles !== undefined && (
                  <DropdownMenuContent align="start">
                  {profile.roles.sort((a, b) => a.localeCompare(b)).map((role) => (
                    <DropdownMenuItem key={role} onClick={() => handleSelectRole(profile, role)}>{role}</DropdownMenuItem>
                  ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </TableCell>
            <TableCell>
              {profile.accountId !== "" ? (
                profile.accountId
              ) : (
                <Loading />
              )}
            </TableCell>
            <TableCell className="flex flex-row justify-center items-center p-2">
              <EditProfile profile={profile} />
              <Button size="icon" variant="ghost" onClick={() => handleDeleteProfile(profile.idx)}>
                <TrashIcon className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </Button>
              <div className="w-12">
                <Button className="w-12 h-7" size="icon" variant="ghost" onClick={() => swapProfileIdxUp(profile.idx)}>
                  <ChevronUp className="w-4 h-4" />
                  <span className="sr-only">SwapProfileIdxUp</span>
                </Button>
                <Button className="w-12 h-7" size="icon" variant="ghost" onClick={() => swapProfileIdxDown(profile.idx)}>
                  <ChevronDown className="w-4 h-4" />
                  <span className="sr-only">SwapProfileIdxDown</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
