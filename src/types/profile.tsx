interface ProfileData {
  idx: number;
  accountId: string;
  selectRole?: string;
  roles: string[];
}

interface Profile extends ProfileData {
  profileName: string;
}

interface ProfileStorage {
  [key: string]: ProfileData
}

interface ConfigureProfile {
  idx?: number;
  profileName: string;
  accountId: string;
  roles: string[];
}

interface EditProfileData {
  idx?: number;
  profileName?: string;
  accountId?: string;
  selectRole?: string;
  roles?: string[];
}

interface ProfileCredentials {
  profileName: string;
  accessKeyId: string;
  secretAccessKey: string;
}

interface EditProfileCredentials extends ProfileCredentials {
  idx: number;
}

interface EditProfileProps {
  idx: number;
  profile: EditProfileCredentials;
}
