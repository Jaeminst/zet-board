interface ProfileData {
  environment: string;
  accessKey: string;
  secretKey: string;
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
