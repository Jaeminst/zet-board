'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileEditIcon } from "lucide-react"
import { useProfile } from '@/contexts/ProfileContext';
import { useForm } from 'react-hook-form'

export function EditProfile({ idx, profile }: EditProfileProps) {
  const { register, handleSubmit } = useForm<EditProfileData>();
  const [profileList, setProfileList] = useProfile();

  const onSubmit = (data: EditProfileData) => {
    editProfileToResult(data);
  };

  const editProfileToResult = (editProfileData: EditProfileData) => {
    const updatedProfileData = {
      idx: editProfileData.idx,
      environment: editProfileData.environment,
      accessKey: editProfileData.accessKey,
      secretKey: editProfileData.secretKey,
      accountId: '123456789012',
      selectRole: 'Administrator',
      roles: ['Administrator','Developers'],
    }
    const updatedProfiles = profileList.map(profile => 
      profile.idx === idx ? { ...profile, ...updatedProfileData } : profile
    );
    setProfileList(updatedProfiles);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FileEditIcon className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/4 md:w-1/2 lg:w-1/3">
        <DialogHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="index">
                List Number
              </label>
              <Input
                id="index"
                placeholder="Enter your index"
                defaultValue={idx.toString()}
                {...register('idx')}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="environment">
                Profile
              </label>
              <Input
                id="environment"
                placeholder="Enter your profile"
                defaultValue={profile.environment}
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
                defaultValue={profile.accessKey}
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
                defaultValue={profile.secretKey}
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
