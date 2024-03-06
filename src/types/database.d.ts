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

type DatabaseInstanceBilledStates =
  | "available"
  | "backing-up"
  | "configuring-enhanced-monitoring"
  | "configuring-iam-database-auth"
  | "configuring-log-exports"
  | "converting-to-vpc"
  | "incompatible-option-group"
  | "incompatible-parameters"
  | "maintenance"
  | "modifying"
  | "moving-to-vpc"
  | "rebooting"
  | "resetting-master-credentials"
  | "renaming"
  | "restore-error"
  | "storage-config-upgrade"
  | "storage-full"
  | "storage-optimization"
  | "upgrading";

type DatabaseInstanceNotBilledStates =
  | "creating"
  | "delete-precheck"
  | "deleting"
  | "failed"
  | "inaccessible-encryption-credentials"
  | "incompatible-network"
  | "incompatible-restore"
  | "insufficient-capacity"

type DatabaseInstanceBilledForStorageStates =
  | "inaccessible-encryption-credentials-recoverable"
  | "starting"
  | "stopped"
  | "stopping"

type DatabaseClusterBilledStates =
  | "available"
  | "backing-up"
  | "backtracking"
  | "failing-over"
  | "maintenance"
  | "migrating"
  | "modifying"
  | "promoting"
  | "renaming"
  | "resetting-master-credentials"
  | "storage-optimization"
  | "update-iam-db-auth"
  | "upgrading";

type DatabaseClusterNotBilledStates =
  | "cloning-failed"
  | "creating"
  | "deleting"
  | "inaccessible-encryption-credentials"
  | "migration-failed";

type DatabaseClusterBilledForStorageStates =
  | "inaccessible-encryption-credentials-recoverable"
  | "starting"
  | "stopped"
  | "stopping";

type DatabaseStates =
  | DatabaseInstanceBilledStates
  | DatabaseInstanceNotBilledStates
  | DatabaseInstanceBilledForStorageStates
  | DatabaseClusterBilledStates
  | DatabaseClusterNotBilledStates
  | DatabaseClusterBilledForStorageStates;
