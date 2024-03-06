interface DbCluster {
  Identifier: string;
  Endpoint: {
    Address: string;
    Port: number;
  };
  ReaderEndpoint: string;
  Status: string;
  Engine: string;
  EngineVersion: string;
  Size: number;
  Role: "Cluster" | "Cluster-RO";
  Instances: DbInstance[];
}

interface DbInstance {
  Identifier: string;
  Endpoint: {
    Address: string;
    Port: number;
    HostedZoneId: string;
  };
  Status: string;
  Engine: string;
  EngineVersion: string;
  Size: string;
  DBClusterIdentifier?: string;
  Role: "Instance" | "Writer Instance" | "Reader Instance";
  Instances?: [];
}

type DbEntity = DbCluster | DbInstance;

interface Databases {
  [key: string]: Database[];
}

interface DatabaseSetting {
  alias?: string;
  localport?: string;
  identifier?: string;
}

interface DatabaseSettings {
  [key: string]: DatabaseSetting[];
}

interface DbClusterEntity extends DatabaseSetting, DbCluster {
  tunneling?: boolean;
}

interface DbInstanceEntity extends DatabaseSetting, DbInstance {
  tunneling?: boolean;
}

type Database = DbClusterEntity | DbInstanceEntity;
