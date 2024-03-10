'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from '@/contexts/ProfileContext';
import { useProfileSession } from '@/contexts/ProfileSessionContext';
import { EditProfile } from './edit-profile';
import { Loading } from '@/components/ui/loading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { copyToClipboard } from '@/lib/clipboard';
import { ProfileActionTypes } from '@/types/actions';
import IpcRenderer from '@/lib/ipcRenderer';

export default function ProfileTable({ profiles }: { profiles: Profile[] }) {
  const { profileList, dispatchProfile } = useProfile();
  const [profileSession, setProfileSession] = useProfileSession();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: number]: string }>({});

  const handleSelectRole = (idx: number, role: string): void => {
    setSelectedRoles(prev => ({ ...prev, [idx]: role }));
    dispatchProfile({ type: ProfileActionTypes.SelectRole, payload: { idx, role }});
  };

  const handleDeleteProfile = (idx: number) => {
    const profileToDelete = profileList.find(profile => profile.idx === idx);
    if (profileToDelete) {
      IpcRenderer.deleteProfile(profileToDelete.profileName, (data) => {
        dispatchProfile({ type: ProfileActionTypes.DeleteProfile, payload: data });
      });
      if (profileToDelete.profileName === profileSession) {
        setProfileSession('Select Profile');
      }
    }
  };

  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead className="w-40 h-[49px]">Profile</TableHead>
          <TableHead className="w-64 pl-8" >Role</TableHead>
          <TableHead className="w-64 pl-6">Account ID</TableHead>
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
                    <DropdownMenuItem key={role} onClick={() => handleSelectRole(profile.idx, role)}>{role}</DropdownMenuItem>
                  ))}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </TableCell>
            <TableCell>
              {profile.accountId !== "" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => copyToClipboard(profile.accountId)}
                        className="p-0 pl-1.5 pr-1.5 justify-start"
                        variant="ghost"
                      >
                        {profile.accountId}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Copy to account id</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                <Button className="w-12 h-7" size="icon" variant="ghost" onClick={() => dispatchProfile({ type: ProfileActionTypes.SwapProfileIdxUp, payload: profile.idx })}>
                  <ChevronUp className="w-4 h-4" />
                  <span className="sr-only">SwapProfileIdxUp</span>
                </Button>
                <Button className="w-12 h-7" size="icon" variant="ghost" onClick={() => dispatchProfile({ type: ProfileActionTypes.SwapProfileIdxDown, payload: profile.idx })}>
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
