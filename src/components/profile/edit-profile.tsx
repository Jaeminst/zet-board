'use client';
import { Button } from '@/components/ui/button';
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { FileEditIcon } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { ProfileActionTypes } from '@/types/actions';
import IpcRenderer from '@/lib/ipcRenderer';

export function EditProfile({ profile }: EditProfileProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileCredentials>();
  const { dispatchProfile } = useProfile();
  const [editProfile, setEditProfile] = useState<ProfileCredentials>();
  const [isAccessKeyFocused, setAccessKeyFocused] = useState(false);
  const [isSecretKeyFocused, setSecretKeyFocused] = useState(false);
  const [isSerialNumberFocused, setSerialNumberFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setAccessKeyFocused(true);
    setSecretKeyFocused(true);
  }, []);

  const handleSerialNumberFocus = useCallback(() => {
    setSerialNumberFocused(true);
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
      setAccessKeyFocused(false);
      setSecretKeyFocused(false);
      setSerialNumberFocused(false);
    }
  }, [open, reset]);

  const onSubmit = (data: ProfileCredentials) => {
    setOpen(false);
    setEditProfile(data);
  };

  useEffect(() => {
    if (editProfile) {
      setEditProfile(undefined);
      dispatchProfile({
        type: ProfileActionTypes.UpdateProfile,
        payload: {
          oldProfileName: editProfile.oldProfileName as string,
          newProfileData: {
            profileName: editProfile.profileName,
            accountId: '',
            roles: [],
            serialNumber: editProfile.serialNumber as string,
          },
        },
      });
      IpcRenderer.updateProfile(editProfile, updateProfile => {
        if (updateProfile) {
          dispatchProfile({
            type: ProfileActionTypes.UpdateProfile,
            payload: updateProfile as EditConfigureProfile,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProfile]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <FileEditIcon className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-3/4 md:w-1/2 lg:w-1/2">
        <DialogHeader>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <input type="hidden" value={profile.profileName} {...register('oldProfileName')} />
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="profileName">
                Profile
                <span className="text-red-600">{errors.profileName?.message}</span>
              </label>
              <Input
                id="profileName"
                placeholder="Enter your profile"
                defaultValue={profile.profileName}
                {...register('profileName', {
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
                placeholder={isAccessKeyFocused ? 'Enter your access key' : '********************'}
                onFocus={handleFocus}
                {...register('accessKeyId', {
                  required: isAccessKeyFocused ? ' is required.' : false,
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
                placeholder={isSecretKeyFocused ? 'Enter your secret key' : '****************************************'}
                onFocus={handleFocus}
                {...register('secretAccessKey', {
                  required: isSecretKeyFocused ? ' is required.' : false,
                })}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="serialNumber">
                SerialNumber
                <span className="text-red-600">{errors.serialNumber?.message}</span>
              </label>
              <Input
                id="serialNumber"
                placeholder={'Enter Serial Number to use mfa'}
                onFocus={handleSerialNumberFocus}
                defaultValue={
                  isSerialNumberFocused ? `arn:aws:iam::${profile.accountId}:mfa/` : profile.serialNumber ?? ''
                }
                {...register('serialNumber')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="ml-auto">
              Enter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
