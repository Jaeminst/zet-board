'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useProfile } from '@/contexts/ProfileContext';
import { useForm } from 'react-hook-form'

export function AddProfile() {
  const { register, handleSubmit } = useForm<ProfileData>();
  const [profileList, setProfileList] = useProfile();

  const onSubmit = (data: ProfileData) => {
    addProfileToResult(data);
  };

  const addProfileToResult = (newProfile: ProfileData) => {
    setProfileList(prevProfiles => [...prevProfiles, {
      idx: prevProfiles.length,
      environment: newProfile.environment,
      accessKey: newProfile.accessKey,
      secretKey: newProfile.secretKey,
      accountId: '123456789012',
      selectRole: 'Administrator',
      roles: ['Administrator','Developers'],
    }]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 ml-auto w-9/10">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/4 md:w-1/2 lg:w-1/3">
        <DialogHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add Profile</h3>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="environment">
                Profile
              </label>
              <Input
                id="environment"
                placeholder="Enter your profile"
                {...register('environment')}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="accessKey">
                Access Key
              </label>
              <Input
                id="accessKey"
                placeholder="Enter your access key"
                {...register('accessKey')}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="secretKey">
                Secret Key
              </label>
              <Input
                id="secretKey"
                placeholder="Enter your secret key"
                {...register('secretKey')}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="ml-auto">Enter</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
