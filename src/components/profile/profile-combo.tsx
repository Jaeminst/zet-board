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
import { useEnvironment } from '@/contexts/EnvironmentContext'

export function ProfileCombo() {
  const [open, setOpen] = useState(false)
  const [profileList] = useProfile();
  const [selectedEnvironment, setSelectedEnvironment] = useEnvironment();
  const handleSelectEnvironment = (environment: string): void => {
    setSelectedEnvironment(environment);
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
          {selectedEnvironment}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandGroup>
            {[...profileList].sort((a, b) => a.idx - b.idx).map((profile) => (
              <CommandItem
                key={profile.idx}
                value={profile.environment}
                onSelect={() => {
                  handleSelectEnvironment(profile.environment)
                  setOpen(false)
                }}
              >
                {profile.environment}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    selectedEnvironment === profile.environment ? 'opacity-100' : 'opacity-0'
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
