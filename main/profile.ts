import { join } from "path";
import { promises as fs } from "fs";
import { homedir } from "os";
import { ipcMain } from "electron/main";
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { getUserName, importListRoles } from "./aws/iamClient.js";
import { getCaller } from "./aws/stsClient.js";
import { errorMessage, successMessage } from "./utils/reply.js";
import { ipcParser } from "./utils/ipcPaser.js";

interface ConfigureProfile {
  idx?: number;
  profileName: string;
  accountId: string;
  roles: string[];
}

export async function initProfile(profile: string) {
  const credentials = fromIni({ profile })
  const getUser = await getUserName({credentials})
  if (!getUser || !getUser.User) {
    throw new Error('Failed to get user information');
  }
  const userName = getUser.User.UserName
  if (!userName) {
    throw new Error('Failed to get user name');
  }
  const roles = await importListRoles({credentials}, userName)
  const getIdentity = await getCaller({credentials})
  const accountId = getIdentity.Account
  if (!accountId) {
    throw new Error('Failed to get account id');
  }
  return { accountId, roles };
}

export function registerIpcProfile() {
  ipcMain.on('init-profiles', async event => {
    const filePath = join(homedir(), ".aws", "credentials");
    const profiles = ["dev", "qa", "stage", "prod"];
    // let existingProfiles: ProfileStorage = {};    
    let existingProfiles: ConfigureProfile[] = [];
    let idx = 0;

    try {
      const data = await fs.readFile(filePath, "utf8");
      for (const profile of profiles) {
        if (data.includes(`[${profile}]`)) {
          const { accountId, roles } = await initProfile(profile);
          existingProfiles.push({
            idx: idx++, // idx 값 할당 후 증가
            profileName: profile, // 프로필 이름 추가
            accountId: accountId, // AWS 계정 ID
            roles: roles, // 역할 리스트
          });
        }
      };
      event.reply('init-profiles', successMessage(existingProfiles))
    } catch (error) {
      event.reply('init-profiles', errorMessage(error));
    }
  });

  ipcMain.on('add-profile', async (event, profileData) => {
    try {
      const parsedData = ipcParser(profileData);
      const profile = parsedData.profileName
      // AWS 자격 증명 파일 경로
      const filePath = join(homedir(), ".aws", "credentials");
      
      // AWS 자격 증명 파일 내용 생성
      const credentialsContent = `
[${profile}]
aws_access_key_id=${parsedData.accessKeyId}
aws_secret_access_key=${parsedData.secretAccessKey}
`;

      // 파일에 내용 추가
      await fs.appendFile(filePath, credentialsContent);
      
      // 추가된 내용 확인
      // const updatedData = await fs.readFile(filePath, "utf8");
      // console.log("Updated credentials file:", updatedData);

      const { accountId, roles } = await initProfile(profile);
      event.reply('add-profile', successMessage({ accountId, roles }));
    } catch (error) {
      event.reply('add-profile', errorMessage(error));
    }
  });
};
