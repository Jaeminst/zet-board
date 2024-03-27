import { IAMClient, GetUserCommand, type GetUserResponse, ListRolesCommand, type Role } from '@aws-sdk/client-iam';

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
export async function getUserName(config: ClientConfig): Promise<GetUserResponse> {
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

export async function importListRoles(config: ClientConfig, userName: string): Promise<string[]> {
  const client = new IAMClient(config);
  const command = new ListRolesCommand({});
  const response = await client.send(command);
  const roles = response.Roles as Role[];
  const filteredRoles: string[] = [];

  for (const role of roles) {
    const roleName = role.RoleName as string;
    const decodeRole = decodeURIComponent(role.AssumeRolePolicyDocument || '');
    const parseRole = JSON.parse(decodeRole);

    for (const statement of parseRole.Statement) {
      const allowUsers = statement.Principal.AWS;

      if (typeof allowUsers === 'string' && allowUsers.endsWith(userName)) {
        filteredRoles.push(roleName);
      } else if (Array.isArray(allowUsers) && allowUsers.some(arn => arn.endsWith(userName))) {
        filteredRoles.push(roleName);
      }
    }
  }

  return filteredRoles;
}
