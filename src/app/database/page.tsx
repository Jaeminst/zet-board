'use client';
import { useEnvironment } from '@/contexts/EnvironmentContext';
import { ProfileMenu } from '@/components/profileMenu';
import Search from '@/components/search';

export default function PlaygroundPage() {
  const [selectedEnvironment] = useEnvironment();
  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileMenu />
        <form className="ml-auto flex-1 sm:flex-initial">
          <Search />
        </form>
      </header>
      <div>hello {selectedEnvironment}</div>
    </div>
  );
}
