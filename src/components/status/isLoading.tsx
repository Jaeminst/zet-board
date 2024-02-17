'use client';
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProfileCombo } from "@/components/profile/profile-combo";
import Search from "@/components/search";

export function IsLoading() {
  return (
    <div className="flex flex-col w-full">
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <ProfileCombo />
        <Search />
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Table className="border shadow-sm rounded-lg p-2">
          <TableHeader>
            <TableRow>
              <TableHead />
            </TableRow>
          </TableHeader>
        </Table>
      </main>
    </div>
  )
}
