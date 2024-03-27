interface Profile {
  idx: number;
  profileName: string;
  accountId: string;
  roles: string[];
  selectRole: string;
  serialNumber: string;
}

interface ConfigureProfile {
  idx?: number;
  profileName: string;
  accountId: string;
  roles: string[];
}

interface AssumeRoleInput {
  RoleArn: string;
  RoleSessionName: string;
  DurationSeconds: number;
  SerialNumber?: string;
  TokenCode?: string;
}

interface AssumeRoleData {
  profileName: string;
  tokenSuffix: string;
  accountId: string;
  role: string;
  serialNumber: string;
  tokenCode: string;
}
