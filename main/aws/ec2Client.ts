import {
  EC2Client,
  DescribeInstancesCommand,
} from "@aws-sdk/client-ec2";

interface ClientConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export async function getInstanceId(
  config: ClientConfig,
  instanceName: string,
): Promise<string> {
  const client = new EC2Client(config);
  const command = new DescribeInstancesCommand({
    Filters: [ // FilterList
      { // Filter
        Name: "tag:Name",
        Values: [ // ValueStringList
          instanceName,
        ],
      },
    ],
  });
  const response = await client.send(command);
  if (!response.Reservations) return '';
  const instanceId = response.Reservations?.[0]?.Instances?.[0].InstanceId;
  return instanceId as string;
}
