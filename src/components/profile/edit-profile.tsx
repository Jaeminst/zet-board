'use client';
import { Button } from "@/components/ui/button"
import { DialogTrigger, DialogHeader, DialogFooter, DialogContent, Dialog, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileEditIcon } from "lucide-react"
import { useProfile } from '@/contexts/ProfileContext';
import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { ipcParser } from "@/lib/ipcParser";

export function EditProfile({ profile }: EditProfileProps ) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileCredentials>();
  const [profileList, setProfileList] = useProfile();
  const [editProfile, setEditProfile] = useState<ProfileCredentials>();
  const [accessKey, setAccessKey] = useState("********************");
  const [secretKey, setSecretKey] = useState("****************************************");

  // 입력 필드 포커스 시 동작할 함수
  const handleFocus = (e: { target: { placeholder: string; }; }) => {
    if (e.target.placeholder === "********************") {
      setAccessKey("Enter your access key");
    }
    if (e.target.placeholder === "****************************************") {
      setSecretKey("Enter your secret key");
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
      setAccessKey("********************");
      setSecretKey("****************************************");
    }
  }, [open, reset]);

  const onSubmit = (data: ProfileCredentials) => {
    setOpen(false);
    setEditProfile(data);
  };

  useEffect(() => {
    if (editProfile) {
      const oldProfileName = editProfile.oldProfileName;
      const profileName = editProfile.profileName;
      const accessKeyId = editProfile.accessKeyId;
      const secretAccessKey = editProfile.secretAccessKey;
      setEditProfile(undefined);
      setProfileList(prevProfiles => prevProfiles.map(profile => 
        profile.profileName === editProfile.oldProfileName ? { ...profile,
          profileName: editProfile.oldProfileName,
          accountId: "",
          roles: []
        } : profile
      ));
      window.electron.profile.send('update-profile', JSON.stringify({
        oldProfileName,
        newProfileData: {
          profileName,
          accessKeyId,
          secretAccessKey,
        }
      }));
      window.electron.profile.once('update-profile', (editProfileString: string) => {
        const editProfile = ipcParser(editProfileString) as EditConfigureProfile;
        if (editProfile) {
          setProfileList(prevProfiles => prevProfiles.map(profile => 
            profile.profileName === editProfile.oldProfileName ? { ...profile,
              profileName: editProfile.newProfileData.profileName, // 업데이트된 프로파일 이름
              accountId: editProfile.newProfileData.accountId, // 업데이트된 계정 ID
              roles: editProfile.newProfileData.roles // 업데이트된 역할
            } : profile
          ));
        };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editProfile])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                placeholder={accessKey}
                onFocus={handleFocus}
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
                placeholder={secretKey}
                onFocus={handleFocus}
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
