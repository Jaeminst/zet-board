'use client';
import { useRouter } from 'next/navigation'
import { DatabaseIcon, Package2Icon, SettingsIcon, UserIcon } from "lucide-react"
import { Button } from "./ui/button";
import { toast } from 'sonner';
import IpcRenderer from '@/lib/ipcRenderer';
import Icon from 'public/icon.svg'

export function Navbar() {
  const router = useRouter()
  function validateLink(route: string) {
    IpcRenderer.getProfileSession((initProfileSession) => {
      initProfileSession !== 'Select Profile'
      ? router.push(route)
      : toast.error('Select Profile')
    });
  }
  return (
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <div className="flex items-center gap-2 font-semibold">
              <Icon className="h-6 w-6" />
              <span className="">AWS</span>
            </div>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Button
                variant='link'
                className="flex justify-start items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => router.push('/')}
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant='link'
                className="flex justify-start items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => validateLink('/database')}
              >
                <DatabaseIcon className="h-4 w-4" />
                Database
              </Button>
              <Button
                variant='link'
                className="flex justify-start items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                onClick={() => validateLink('/loading')}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </div>
  )
}
