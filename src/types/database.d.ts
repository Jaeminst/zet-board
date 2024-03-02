interface DatabaseData {
  identifier: string;
  endpoint: string;
  status: string;
  role: string;
  engine: string;
  size: string;
}

interface DatabaseSetting {
  alias: string,
  localport: string;
  identifier: string;
}

interface DatabaseList extends DatabaseSetting, DatabaseData {
  idx: number;
  tunneling: boolean;
}