import { join } from "path";
import { PathLike, promises as fs } from "fs";
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

export async function initProfile(profileName: string) {
  const credentials = fromIni({ profile: profileName })
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
      const profile = parsedData.profileName;
      // 자격 증명 파일 경로
      const credentialsFilePath = join(homedir(), ".aws", "credentials");
      // 설정 파일 경로
      const configFilePath = join(homedir(), ".aws", "config");
      // 파일 내용 읽기 및 마지막 줄 공백 검사
      async function appendContentWithNewlineCheck(filePath: PathLike | fs.FileHandle, content: string) {
        let fileContent = await fs.readFile(filePath, 'utf8');
        // 파일의 마지막 줄이 공백이 아니면 줄바꿈 추가하여 새로운 내용에만 반영
        const contentToAdd = fileContent.endsWith('\n') ? content : '\n' + content;
        await fs.appendFile(filePath, contentToAdd);
      }
      // 자격 증명 파일 및 설정 파일 내용 검사 및 추가
      const credentialsContent = `[${profile}]
aws_access_key_id=${parsedData.accessKeyId}
aws_secret_access_key=${parsedData.secretAccessKey}
`;
      await appendContentWithNewlineCheck(credentialsFilePath, credentialsContent);
      const configContent = `[profile ${profile}]
output=json
region=ap-northeast-2
`;
      await appendContentWithNewlineCheck(configFilePath, configContent);
      const { accountId, roles } = await initProfile(profile);
      event.reply('add-profile', successMessage({ accountId, roles }));
    } catch (error) {
      event.reply('add-profile', errorMessage(error));
    }
  });

  ipcMain.on('delete-profile', async (event, profileName) => {
    try {
      // 자격 증명 파일과 설정 파일 경로
      const credentialsFilePath = join(homedir(), ".aws", "credentials");
      const configFilePath = join(homedir(), ".aws", "config");
      // 파일 내용 읽고 수정하는 함수를 정의
      const deleteProfileFromFile = async (filePath: PathLike | fs.FileHandle, profileSectionName: string) => {
        let fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
        const profileStart = fileContent.indexOf(`[${profileSectionName}]`);
        if (profileStart === -1) {
          return; // 프로파일이 파일에 없으면 아무 것도 하지 않음
        }
        let profileEnd = fileContent.indexOf('[', profileStart + 1);
        profileEnd = profileEnd === -1 ? fileContent.length : profileEnd;
        fileContent = fileContent.substring(0, profileStart) + fileContent.substring(profileEnd);
        await fs.writeFile(filePath, fileContent);
      };
      // 자격 증명 파일에서 프로파일 삭제
      await deleteProfileFromFile(credentialsFilePath, profileName);
      // 설정 파일에서 프로파일 삭제 (프로파일 이름 앞에 'profile ' 접두사 추가)
      await deleteProfileFromFile(configFilePath, `profile ${profileName}`);
      event.reply('delete-profile', successMessage({ profileName }));
    } catch (error) {
      event.reply('delete-profile', errorMessage(error));
    }
  });
};
