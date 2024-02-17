interface DatabaseData {
  identifier: string;
  endpoint: string;
  status: string;
  role: string;
  engine: string;
  size: string;
}

interface Database extends DatabaseData {
  idx: number;
  tunneling: boolean;
  localport: string;
  alias: string,
}