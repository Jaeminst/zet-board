import { join } from "path";
import { promises as fs } from "fs";
import { homedir } from "os";
import { ipcMain } from "electron/main";
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

interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
}

async function getAwsCredentials(profile: string): Promise<AwsCredentials> {
  const credentialsPath = join(homedir(), '.aws', 'credentials');
  const content = await fs.readFile(credentialsPath, { encoding: 'utf-8' });
  const lines = content.split(/\r?\n/);
  let currentProfile = '';
  let credentials: AwsCredentials | null = null; // 초기값을 null로 설정
  for (const line of lines) {
    const profileMatch = line.match(/^\[(.+)\]$/);
    if (profileMatch) {
      currentProfile = profileMatch[1];
    } else if (currentProfile === profile) {
      const matchAccessKey = line.match(/^aws_access_key_id\s*=\s*(.+)$/);
      const matchSecretKey = line.match(/^aws_secret_access_key\s*=\s*(.+)$/);
      if (matchAccessKey) {
        credentials = credentials || { accessKeyId: '', secretAccessKey: '' }; // 객체가 아직 없으면 생성
        credentials.accessKeyId = matchAccessKey[1];
      } else if (matchSecretKey) {
        credentials = credentials || { accessKeyId: '', secretAccessKey: '' }; // 객체가 아직 없으면 생성
        credentials.secretAccessKey = matchSecretKey[1];
      }
    }
  }
  if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey) {
    throw new Error(`Credentials not found for profile: ${profile}`);
  }
  return credentials;
}

export async function initProfile(profile: string) {
  const credentials = await getAwsCredentials(profile);
  const config = { credentials };
  const getUser = await getUserName(config)
  if (!getUser || !getUser.User) {
    throw new Error('Failed to get user information');
  }
  const userName = getUser.User.UserName
  if (!userName) {
    throw new Error('Failed to get user name');
  }
  const roles = await importListRoles(config, userName)
  const getIdentity = await getCaller(config)
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
      const profileName = parsedData.profileName;
      // 자격 증명 파일 경로
      const credentialsFilePath = join(homedir(), ".aws", "credentials");
      // 설정 파일 경로
      const configFilePath = join(homedir(), ".aws", "config");
      // 파일 내용 읽기 및 마지막 줄 공백 검사
      async function appendContentWithNewlineCheck(filePath: string, content: string) {
        let fileContent = await fs.readFile(filePath, 'utf8');
        // 프로파일 중복 검사
        if (fileContent.includes(`[${profileName}]`) || fileContent.includes(`[profile ${profileName}]`)) {
          throw new Error('Profile already exists');
        }
        // 파일의 마지막 줄이 공백이 아니면 줄바꿈 추가하여 새로운 내용에만 반영
        const contentToAdd = fileContent.endsWith('\n') ? content : '\n' + content;
        await fs.appendFile(filePath, contentToAdd);
      }
      // 자격 증명 파일 및 설정 파일 내용 검사 및 추가
      const credentialsContent = `[${profileName}]
aws_access_key_id=${parsedData.accessKeyId}
aws_secret_access_key=${parsedData.secretAccessKey}
`;
      const configContent = `[profile ${profileName}]
region = ap-northeast-2
output = json
`;
      await Promise.all([
        appendContentWithNewlineCheck(credentialsFilePath, credentialsContent),
        appendContentWithNewlineCheck(configFilePath, configContent)
      ]);
      const { accountId, roles } = await initProfile(profileName);
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
      const deleteProfileFromFile = async (filePath: string, profileSectionName: string) => {
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

  ipcMain.on('update-profile', async (event, profileData) => {
    try {
      const parsedData = ipcParser(profileData);
      const oldProfileName = parsedData.oldProfileName;
      const newProfileData = parsedData.newProfileData;
      // 자격 증명 파일 및 설정 파일 경로
      const credentialsFilePath = join(homedir(), ".aws", "credentials");
      const configFilePath = join(homedir(), ".aws", "config");

      // 기존 프로파일 삭제 로직
      const deleteProfileFromFile = async (filePath: string, profileSectionName: string) => {
        let fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
        const profileStart = fileContent.indexOf(`[${profileSectionName}]`);
        if (profileStart === -1) {
          return;
        }
        let profileEnd = fileContent.indexOf('[', profileStart + 1);
        profileEnd = profileEnd === -1 ? fileContent.length : profileEnd;
        fileContent = fileContent.substring(0, profileStart) + fileContent.substring(profileEnd);
        await fs.writeFile(filePath, fileContent);
      };
      await Promise.all([
        deleteProfileFromFile(credentialsFilePath, oldProfileName),
        deleteProfileFromFile(configFilePath, `profile ${oldProfileName}`)
      ]);

      // 새 프로파일 추가 로직
      // 파일 내용 읽기 및 마지막 줄 공백 검사
      async function appendContentWithNewlineCheck(filePath: string, content: string) {
        let fileContent = await fs.readFile(filePath, 'utf8');
        // 프로파일 중복 검사
        if (fileContent.includes(`[${newProfileData.profileName}]`) || fileContent.includes(`[profile ${newProfileData.profileName}]`)) {
          throw new Error('Profile already exists');
        }
        // 파일의 마지막 줄이 공백이 아니면 줄바꿈 추가하여 새로운 내용에만 반영
        const contentToAdd = fileContent.endsWith('\n') ? content : '\n' + content;
        await fs.appendFile(filePath, contentToAdd);
      }
      // 자격 증명 파일 및 설정 파일 내용 검사 및 추가
      const credentialsContent = `[${newProfileData.profileName}]
aws_access_key_id=${newProfileData.accessKeyId}
aws_secret_access_key=${newProfileData.secretAccessKey}
`;
      const configContent = `[profile ${newProfileData.profileName}]
region = ap-northeast-2
output = json
`;
      await Promise.all([
        appendContentWithNewlineCheck(credentialsFilePath, credentialsContent),
        appendContentWithNewlineCheck(configFilePath, configContent)
      ]);
      const { accountId, roles } = await initProfile(newProfileData.profileName);
      event.reply('update-profile', successMessage({
        oldProfileName,
        newProfileData: {
          profileName: newProfileData.profileName,
          accountId,
          roles
        }
      }));
    } catch (error) {
      event.reply('update-profile', errorMessage(error));
    }
  });
};
