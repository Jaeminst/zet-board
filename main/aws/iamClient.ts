import {
  IAMClient,
  GetUserCommand,
  ListRolesCommand,
  Role,
} from "@aws-sdk/client-iam";

interface ClientConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * Get an User Name
 *
 * @public
 * @param {object} config
{
  accessKeyId: "STRING",
  secretAccessKey: "STRING"
}
 * @returns {Promise<object>} { User: { UserName: "STRING_VALUE" } }
 */
export async function getUserName(config: ClientConfig) {
  const client = new IAMClient(config);
  const command = new GetUserCommand({});
  const response = await client.send(command);
  return response;
}

/**
 * Get an List Roles
 *
 * @public
 * @param {object} config
{
  accessKeyId: "STRING",
  secretAccessKey: "STRING"
}
 * @returns {Promise<string[]>} [ "STRING", ... ] }
 */

export async function importListRoles(
  config: ClientConfig,
  userName: string
): Promise<string[]> {
  const client = new IAMClient(config);
  const command = new ListRolesCommand({});
  const response = await client.send(command);
  const roles: Role[] | undefined = response.Roles;

  const filteredRoles: string[] = [];

  if (!roles || !roles.length) return [];

  for (const role of roles) {
    const roleName: string | undefined = role.RoleName;

    if (!roleName) continue; // RoleName이 undefined인 경우에는 처리하지 않고 다음 iteration으로 넘어감

    const decodeRole = decodeURIComponent(role.AssumeRolePolicyDocument || "");
    const parseRole = JSON.parse(decodeRole);

    for (const statement of parseRole.Statement) {
      const allowUsers = statement.Principal.AWS;

      if (typeof allowUsers === "string" && allowUsers.endsWith(userName)) {
        filteredRoles.push(roleName);
      } else if (
        Array.isArray(allowUsers) &&
        allowUsers.some((arn) => arn.endsWith(userName))
      ) {
        filteredRoles.push(roleName);
      }
    }
  }

  return filteredRoles;
}
