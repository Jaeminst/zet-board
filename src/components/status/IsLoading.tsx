'use client';
import Search from "@/components/Search";
import { ProfileCombo } from "@/components/profile/profile-combo";
import { IsLoadingTable } from "./IsLoadingTable";

export function IsLoading() {
  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileCombo />
        <Search />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <IsLoadingTable />
      </main>
    </div>
  )
}
