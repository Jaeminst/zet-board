import {
  STSClient,
  GetCallerIdentityCommand,
  AssumeRoleCommand,
  AssumeRoleCommandInput,
} from "@aws-sdk/client-sts";

interface ClientConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * Get Caller Identity
 *
 * @public
 * @param {object} config
  {
    accessKeyId: "STRING", // required
    secretAccessKey: "STRING", // required
    sessionToken: "STRING", // Only Assume-Role
  }
 * @returns {Promise<object>} { Account: "STRING" }
 */
export async function getCaller(config: ClientConfig) {
  const client = new STSClient(config);
  const command = new GetCallerIdentityCommand({});
  const response = await client.send(command);
  return response;
}

/**
 * Assume-Role
 *
 * @public
 * @param {object} config
  {
    accessKeyId: "STRING",
    secretAccessKey: "STRING"
  }
 * @param {object} input
  {
    RoleArn: "STRING", // required
    RoleSessionName: "STRING", // required
    DurationSeconds: Number("int"), // Dev, QA, Stage = 14400(4 hour) // Prod = 3600(default)
    SerialNumber: "STRING", // Only Prod
    TokenCode: "STRING", // Only Prod
  }
 * @returns {Promise<object>} { Credentials: { ... } }
 */
export async function assumeRole(
  config: ClientConfig,
  input: AssumeRoleCommandInput
) {
  const client = new STSClient(config);
  const command = new AssumeRoleCommand(input);
  const response = await client.send(command);
  return response;
}
