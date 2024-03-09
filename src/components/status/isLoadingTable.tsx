'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function IsLoadingTable() {
  return (
    <Table className="border shadow-sm rounded-lg p-2">
      <TableHeader>
        <TableRow>
          <TableHead className='h-[49px]' />
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className='h-[50px]' />
        </TableRow>
        <TableRow>
          <TableCell className='h-[50px]' />
        </TableRow>
        <TableRow>
          <TableCell className='h-[50px]' />
        </TableRow>
        <TableRow>
          <TableCell className='h-[50px]' />
        </TableRow>
      </TableBody>
    </Table>
  )
}
