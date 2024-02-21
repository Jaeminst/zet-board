'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "lucide-react"
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { useProfile } from '@/contexts/ProfileContext';
import { useProfileSearch } from "@/contexts/ProfileSearchContext";

export function AddProfile() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileData>();
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

  const onSubmit = (data: ProfileData) => {
    setOpen(false);
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
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="environment">
                Profile
                <span className="text-red-600">{errors.environment?.message}</span>
              </label>
              <Input
                type="text"
                id="environment"
                placeholder="Enter your profile"
                {...register('environment',{
                  required: ' is required.',
                })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="accessKey">
                Access Key
                <span className="text-red-600">{errors.accessKey?.message}</span>
              </label>
              <Input
                type="text"
                id="accessKey"
                placeholder="Enter your access key"
                {...register('accessKey',{
                  required: ' is required.',
                })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="secretKey">
                Secret Key
                <span className="text-red-600">{errors.secretKey?.message}</span>
              </label>
              <Input
                type="text"
                id="secretKey"
                placeholder="Enter your secret key"
                {...register('secretKey',{
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
