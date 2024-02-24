interface ProfileData {
  profileName: string;
  accessKey: string;
  secretKey: string;
}

interface EditProfileData extends ProfileData {
  idx: number;
}

interface Profile extends ProfileData {
  idx: number;
  accountId: string;
  selectRole: string;
  roles: string[];
}

interface EditProfileProps {
  idx: number;
  profile: Profile;
}
