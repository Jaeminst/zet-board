type ipcDatabase =
  | "init-databases"
  | "databases-metric"
  | "get-databaseList"
  | "set-databaseList"
  | "get-databaseSettings"
  | "set-databaseSettings"

interface DescribeCluster {
  Identifier: string | undefined;
  Endpoint: Endpoint | undefined;
  ReaderEndpoint: string | undefined;
  Status: string | undefined;
  Engine: string | undefined;
  EngineVersion: string | undefined;
  Size: number | undefined;
  Role: 'Cluster';
  DBClusterMembers?: DBClusterMembers[];
  Instances?: DbInstance[];
}
type DBClusterMembers = {
  DBInstanceIdentifier?: string | undefined;
  IsClusterWriter?: boolean | undefined;
  DBClusterParameterGroupStatus?: string | undefined;
  PromotionTier?: number | undefined;
};

interface DescribeInstance {
  Identifier: string | undefined;
  Endpoint: Endpoint | undefined;
  Status: string | undefined;
  Engine: string | undefined;
  EngineVersion: string | undefined;
  Size: string | undefined;
  Role?: 'Instance' | 'Writer Instance' | 'Reader Instance' | 'Cluster-RO';
  DBClusterIdentifier?: string;
}
type Endpoint = {
  Address?: string | undefined;
  Port?: number | undefined;
  HostedZoneId?: string | undefined;
}

interface InstanceMap {
  [Identifier: string]: DbInstance;
}

type DbEntity = DescribeCluster | DescribeInstance;
