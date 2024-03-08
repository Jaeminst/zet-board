'use client';
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function IsLoadingTable() {
  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead />
        </TableRow>
      </TableHeader>
    </Table>
  )
}
