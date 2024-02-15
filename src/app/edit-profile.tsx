'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileEditIcon } from "lucide-react"
import { useState } from "react";
import { useProfile } from '@/contexts/ProfileContext';

interface Profile {
  environment: string;
  accessKey: string;
  secretKey: string;
}

interface EditProfileProps {
  idx: number;
  profile: Profile;
}

export function EditProfile({ idx, profile }: EditProfileProps) {
  const [profileList, setProfileList] = useProfile();
  const [index, setIndex] = useState<string>(idx.toString());
  const [profileData, setProfileData] = useState<Profile>({ environment: profile.environment, accessKey: profile.accessKey, secretKey: profile.secretKey });
  const handleSubmit = () => {
    addProfileToResult(profileData);
  };

  const addProfileToResult = (editProfileData: Profile) => {
    const updatedProfileData = {
      idx: parseInt(index),
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
        <div className="p-6 space-y-6">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="index">
              List Number
            </label>
            <Input
              id="index"
              placeholder="Enter your index"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </div>
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
