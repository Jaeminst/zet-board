'use client'
import { useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useProfile } from '@/contexts/ProfileContext'
import { useProfileSession } from '@/contexts/ProfileSessionContext'
import { toast } from 'sonner'

export function ProfileCombo() {
  const [open, setOpen] = useState(false)
  const [profileList] = useProfile();
  const [profileSession, setProfileSession] = useProfileSession();
  const handleSelectProfileSession = (profileName: string, selectRole: string | undefined): void => {
    if (selectRole) {
      setProfileSession(profileName);
      localStorage.setItem('profileSession', profileName);
    } else {
      toast(`${profileName} 역할이 선택되지 않았습니다.`, {
        description: `Select Role: ${selectRole}`,
        duration: 5000
      });
      localStorage.setItem('profileSession', 'Select Profile');
      setProfileSession('Select Profile');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {profileSession}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandGroup>
            {Array.isArray(profileList) && [...profileList].sort((a, b) => a.idx - b.idx).map((profile) => (
              <CommandItem
                key={profile.idx}
                value={profile.profileName}
                onSelect={() => {
                  handleSelectProfileSession(profile.profileName, profile.selectRole)
                  setOpen(false)
                }}
              >
                {profile.profileName}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    profileSession === profile.profileName ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
