const ipcDatabaseEvents = [
  'init-databases',
  'databases-metric',
  'get-databaseList',
  'set-databaseList',
  'get-databaseSettings',
  'set-databaseSettings',
] as const;
type ipcDatabase = typeof ipcDatabaseEvents[number];

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
  Instances?: DescribeInstance[];
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
  [Identifier: string]: DescribeInstance;
}

type DbEntity = DescribeCluster | DescribeInstance;
