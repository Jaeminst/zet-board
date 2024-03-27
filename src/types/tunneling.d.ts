type ipcTunneling = (typeof window.electron.ipcTunnelingEvents)[number];

interface TunnelingData {
  type: string;
  localPort: string;
  address: string;
  port: number;
  tunneling: boolean;
}

interface TunnelingStatus {
  address: string;
  tunneling: boolean;
}
