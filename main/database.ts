import { describeClusters, describeInstances } from "./aws/rdsClient";
import { getAwsCredentials } from "./utils/credentials";
import { ipcMainListener } from "./utils/ipc";


function mergeData(clusters: DescribeCluster[], instances: DescribeInstance[]) {
  // 인스턴스 매핑 생성
  const instanceMap: InstanceMap = instances.reduce((map: InstanceMap, instance) => {
    if (!instance || !instance.Identifier) {
      throw new Error('Failed to Identifier');
    }
    map[instance.Identifier] = instance;
    return map;
  }, {});

  // 클러스터와 인스턴스 통합
  const mergedData: DbEntity[] = clusters.map(cluster => {
    // DBClusterMembers 제외하고 나머지 클러스터 정보 사용
    if (!cluster || !cluster.DBClusterMembers) {
      throw new Error('Failed to DBClusterMembers');
    }
    const { DBClusterMembers, ...rest } = cluster;
    const clusterInstances: DescribeInstance[] = DBClusterMembers.map(member => {
      // 인스턴스의 엔드포인트와 포트 정보, 역할 정보 등 갱신
      if (!member || !member.DBInstanceIdentifier) {
        throw new Error('Failed to Identifier');
      }
      const instance = instanceMap[member.DBInstanceIdentifier];
      const role = member.IsClusterWriter ? 'Writer Instance' : 'Reader Instance';
      return { ...instance, Role: role };
    });
    if (!cluster.Endpoint || !cluster.Endpoint.Port) {
      throw new Error('Failed to cluster.Endpoint.Port');
    }
    clusterInstances.unshift({
      Identifier: `${cluster.Identifier}-ro`,
      Endpoint: {
        Address: cluster.ReaderEndpoint,
        Port: cluster.Endpoint.Port
      },
      Status: '',
      Engine: '',
      EngineVersion: '',
      Size: '',
      Role: 'Cluster-RO'
    })

    // DBClusterMembers 정보를 제외하고 나머지 정보와 함께 새 객체 생성
    return { ...rest, Instances: clusterInstances };
  });

  // 독립 인스턴스 추가
  instances.forEach(instance => {
    if (!instance.DBClusterIdentifier) {
      const { DBClusterIdentifier, ...instanceWithoutDBClusterIdentifier } = instance;
      mergedData.push({
        ...instanceWithoutDBClusterIdentifier,
        Role: 'Instance',
      });
    }
  });

  // 정렬
  mergedData.sort((a, b) => {
    if (!a.Identifier || !b.Identifier) {
      throw new Error('Failed to Identifier');
    }
    return a.Identifier.localeCompare(b.Identifier);
  });
  return mergedData;
}



export function registerIpcDatabase() {
  ipcMainListener('init-databases', async ({ data }) => {
    const profileName = data.profileName;
    const tokenSuffix = data.tokenSuffix;
    const sessionProfileName = `${profileName}${tokenSuffix}`;
    const credentials = await getAwsCredentials(sessionProfileName);
    const config = { credentials };

    const responseClusters = await describeClusters(config, {})
    if (!responseClusters || !responseClusters.DBClusters) {
      throw new Error('Failed to get instances');
    }
    const clusters: DescribeCluster[] = responseClusters.DBClusters.map(cluster => ({
      Identifier: cluster.DBClusterIdentifier,
      Endpoint: {
        Address: cluster.Endpoint,
        Port: cluster.Port
      },
      ReaderEndpoint: cluster.ReaderEndpoint,
      Status: cluster.Status,
      Engine: cluster.Engine,
      EngineVersion: cluster.EngineVersion,
      Size: cluster.DBClusterMembers?.length,
      Role: 'Cluster',
      DBClusterMembers: cluster.DBClusterMembers
    }));

    const responseInstances = await describeInstances(config, {})
    if (!responseInstances || !responseInstances.DBInstances) {
      throw new Error('Failed to get instances');
    }
    const instances: DescribeInstance[] = responseInstances.DBInstances.map(instance => ({
      Identifier: instance.DBInstanceIdentifier,
      Endpoint: instance.Endpoint,
      Status: instance.DBInstanceStatus,
      Engine: instance.Engine,
      EngineVersion: instance.EngineVersion,
      Size: instance.DBInstanceClass,
      DBClusterIdentifier: instance?.DBClusterIdentifier,
    }));

    const mergedDataResult = mergeData(clusters, instances);
    return mergedDataResult as DbEntity[]
  });
};
