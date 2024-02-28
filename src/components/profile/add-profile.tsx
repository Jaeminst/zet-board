'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { useProfile } from '@/contexts/ProfileContext';
import { useProfileSearch } from "@/contexts/ProfileSearchContext";
import { ipcParser } from "@/lib/ipcPaser";

export function AddProfile() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileCredentials>();
  const [profileList, setProfileList] = useProfile();
  const [profileSearchList, setProfileSearchList] = useProfileSearch();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    setProfileSearchList(profileList);
  }, [profileList, setProfileSearchList]);

  const onSubmit = (data: ProfileCredentials) => {
    setOpen(false);
    addProfileToResult(data);
  };

  const addProfileToResult = async (newProfile: ProfileCredentials) => {
    const profileName = newProfile.profileName;
    const accessKeyId = newProfile.accessKeyId;
    const secretAccessKey = newProfile.secretAccessKey;
    const profile: Profile = {
      idx: profileList.length,
      profileName,
      accountId: "",
      roles: []
    };
    setProfileList(prevProfiles => [...prevProfiles, profile]);
    window.electron.profile.send('add-profile', JSON.stringify({
      profileName,
      accessKeyId,
      secretAccessKey,
    }));
    window.electron.profile.once('add-profile', (addProfileString: string) => {
      const addProfile = ipcParser(addProfileString) as ConfigureProfile;
      if (addProfile) {
        setProfileList(prevProfiles => prevProfiles.map(profile => 
          profile.profileName === profileName ? { ...profile,
            profileName,
            accountId: addProfile.accountId,
            roles: addProfile.roles
          } : profile
        ));
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="profileName">
                Profile
                <span className="text-red-600">{errors.profileName?.message}</span>
              </label>
              <Input
                id="profileName"
                placeholder="Enter your profile"
                {...register('profileName',{
                  required: ' is required.',
                })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="accessKeyId">
                Access Key
                <span className="text-red-600">{errors.accessKeyId?.message}</span>
              </label>
              <Input
                id="accessKeyId"
                placeholder="Enter your access key"
                {...register('accessKeyId',{
                  required: ' is required.',
                })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="secretAccessKey">
                Secret Key
                <span className="text-red-600">{errors.secretAccessKey?.message}</span>
              </label>
              <Input
                id="secretAccessKey"
                placeholder="Enter your secret key"
                {...register('secretAccessKey',{
                  required: ' is required.',
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="ml-auto">Enter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
