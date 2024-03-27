import {
  RDSClient,
  DescribeDBClustersCommand,
  DescribeDBInstancesCommand,
  type DescribeDBClustersCommandInput,
  type DescribeDBInstancesCommandInput,
} from '@aws-sdk/client-rds';

/**
 * Retrieves information about RDS clusters.
 *
 * @public
 * @param {object} input - Input parameters for the function.
 * @returns {Promise<object>} { DBClusters: [ ... ] }
 */
export async function describeClusters(config: ClientConfig, input: DescribeDBClustersCommandInput) {
  const client = new RDSClient(config);
  const command = new DescribeDBClustersCommand(input);
  const response = await client.send(command);
  return response;
}

/**
 * Retrieves information about RDS instances.
 *
 * @public
 * @param {object} input - Input parameters for the function.
 * @returns {Promise<object>} { DBInstances: [ ... ] }
 */
export async function describeInstances(config: ClientConfig, input: DescribeDBInstancesCommandInput) {
  const client = new RDSClient(config);
  const command = new DescribeDBInstancesCommand(input);
  const response = await client.send(command);
  return response;
}
