'use client';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/contexts/ProfileContext';
import { useProfileSearch } from '@/contexts/ProfileSearchContext';
import { SearchIcon } from 'lucide-react';
import { useLayoutEffect } from 'react';

export default function ProfileSearch({ disabled }: { disabled?: boolean }) {
  const { profileList } = useProfile();
  const [profileSearchList, setProfileSearchList] = useProfileSearch();

  useLayoutEffect(() => {
    if (!profileSearchList.length) {
      setProfileSearchList(profileList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileList]);

  function handleSearch(value: string) {
    const search = value.toLowerCase() ?? '';
    const filteredResult = profileList.filter(item =>
      item.profileName.toLowerCase().includes(search)
      || item.accountId.toLowerCase().includes(search)
      || item.selectRole?.toLowerCase().includes(search)
    );
    const searchProfiles = filteredResult as Profile[];
    value !== '' ? setProfileSearchList(searchProfiles) : setProfileSearchList(profileList)
  }

  return (
    <form className="ml-auto flex-1 sm:flex-initial">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="rounded-md shadow-sm">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
            aria-hidden="true"
          >
            <SearchIcon
              className="mr-3 h-4 w-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
            />
          </div>
          <Input
            id="search"
            type="search"
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
            placeholder=""
            spellCheck={false}
            disabled={disabled}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
