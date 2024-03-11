type ipcProfile =
  | 'init-profiles'
  | 'add-profile'
  | 'delete-profile'
  | 'update-profile'
  | 'assume-role'
  | 'session-expired'
  | 'default-profile'
  | 'get-profileList'
  | 'set-profileList'
  | 'get-profileSession'
  | 'set-profileSession'
  | 'get-profileSessions'
  | 'set-profileSessions'

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
  tokenCode: string;
}