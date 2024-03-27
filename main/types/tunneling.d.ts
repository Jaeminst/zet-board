interface TunnelingData {
  type: string;
  address: string;
  port: number;
  profileName: string;
  tokenSuffix: string;
  tunneling: boolean;
}

interface TunnelingStatus {
  address: string;
  tunneling: boolean;
}
