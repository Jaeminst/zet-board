'use client';
import { useRouter } from 'next/navigation'
import { DatabaseIcon, Package2Icon, SettingsIcon, ShieldX, UserIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button";
import { toast } from 'sonner';

export function Navbar() {
  const router = useRouter()
  return (
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Package2Icon className="h-6 w-6" />
              <span className="">AWS</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="/"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
              <Button
                variant='link'
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => {
                  localStorage.getItem('profileSession') !== 'Select Profile'
                  ? router.push('/database')
                  : toast.error('Select Profile', { icon: <ShieldX />})
                }}
              >
                <DatabaseIcon className="h-4 w-4" />
                Database
              </Button>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>
  )
}
