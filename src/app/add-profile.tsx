import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useState } from "react";
import { useProfile } from '@/contexts/ProfileContext';

interface Profile {
  environment: string;
  accessKey: string;
  secretKey: string;
}

export function AddProfile() {
  const [profileList, setProfileList] = useProfile();
  const [profileData, setProfileData] = useState({ environment: '', accessKey: '', secretKey: '' });
  const handleSubmit = () => {
    addProfileToResult(profileData);
    setProfileData({ environment: '', accessKey: '', secretKey: '' });
  };
  const addProfileToResult = (newProfile: Profile) => {
    setProfileList(prevProfiles => [...prevProfiles, {
      idx: prevProfiles.length + 1,
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
        <div className="p-6 space-y-6">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="profile">
              Profile
            </label>
            <Input
              id="profile"
              placeholder="Enter your profile"
              value={profileData.environment}
              onChange={(e) => setProfileData({ ...profileData, environment: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="access-key">
              Access Key
            </label>
            <Input
              id="access-key"
              placeholder="Enter your access key"
              value={profileData.accessKey}
              onChange={(e) => setProfileData({ ...profileData, accessKey: e.target.value })}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="secret-key">
              Secret Key
            </label>
            <Input
              id="secret-key"
              placeholder="Enter your secret key"
              value={profileData.secretKey}
              onChange={(e) => setProfileData({ ...profileData, secretKey: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" className="ml-auto" onClick={handleSubmit}>Enter</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
