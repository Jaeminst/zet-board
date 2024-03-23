import { join } from 'path';
import fs from 'fs';
import { homedir } from 'os';
import { getUserName, importListRoles } from './aws/iamClient.js';
import { getCaller, assumeRole } from './aws/stsClient.js';
import { successMessage } from './utils/reply.js';
import { ipcMainListener, ipcMainListenerSync } from './utils/ipc.js';
import { setRepeater } from './utils/setTimer.js';
import { getAwsCredentials } from './utils/credentials.js';
import Store from './utils/store.js';
import { getDate } from './utils/date.js';

// 자격 증명 파일 및 설정 파일 경로
const credentialsFilePath = join(homedir(), '.aws', 'credentials');
const configFilePath = join(homedir(), '.aws', 'config');

// 프로파일 정보 조회
async function initProfile(profile: string) {
  const credentials = await getAwsCredentials(profile);
  const config = { credentials };
  const getUser = await getUserName(config);
  if (!getUser || !getUser.User) {
    throw new Error('Failed to get user information');
  }
  const userName = getUser.User.UserName;
  const roles = await importListRoles(config, userName as string);
  const getIdentity = await getCaller(config);
  const accountId = getIdentity.Account as string;
  return { accountId, roles };
}

// 신규 프로파일 추가
async function appendProfileInFile(filePath: string, profileName: string, content: string) {
  // 파일 내용 읽기 및 마지막 줄 공백 검사
  let fileContent = fs.readFileSync(filePath, 'utf8');
  // 프로파일 중복 검사
  if (fileContent.includes(profileName)) {
    throw new Error('Profile already exists');
  }
  // 파일의 마지막 줄이 공백이 아니면 줄바꿈 추가하여 새로운 내용에만 반영
  const contentToAdd = fileContent.endsWith('\n') ? content : '\n' + content;
  fs.appendFileSync(filePath, contentToAdd);
}

// 기존 프로파일 삭제
async function deleteProfileInFile(filePath: string, profileName: string) {
  let fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const profileStart = fileContent.indexOf(profileName);
  if (profileStart === -1) {
    return;
  }
  let profileEnd = fileContent.indexOf('[', profileStart + 1);
  profileEnd = profileEnd === -1 ? fileContent.length : profileEnd;
  fileContent = fileContent.substring(0, profileStart) + fileContent.substring(profileEnd);
  fs.writeFileSync(filePath, fileContent);
}

async function updateProfileInFile(filePath: string, oldProfileName: string, newProfileData: string) {
  // 파일의 전체 내용을 읽어옵니다.
  let fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

  // 프로필의 시작 위치를 찾습니다.
  const startIdx = fileContent.indexOf(oldProfileName);
  if (startIdx === -1) {
    throw new Error('Profile not found');
  }

  // 다음 프로필의 시작 위치를 찾습니다. 없다면 파일 끝으로 간주합니다.
  let endIdx = fileContent.indexOf('\n', startIdx + oldProfileName.length);
  if (newProfileData.includes('\n')) {
    endIdx = fileContent.indexOf('\n[', startIdx + oldProfileName.length);
  }
  endIdx = endIdx !== -1 ? endIdx : fileContent.length;

  // 시작 위치와 끝 위치를 기준으로 파일 내용을 교체합니다.
  fileContent = fileContent.substring(0, startIdx) + newProfileData + fileContent.substring(endIdx);

  // 변경된 내용으로 파일을 다시 씁니다.
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
}

export function registerIpcProfile(store: Store) {
  ipcMainListener('get-profileList', () => {
    const profileList = store.get('profileList');
    return profileList;
  });
  ipcMainListenerSync('set-profileList', data => {
    store.set('profileList', data);
    return 'set-profileList';
  });
  ipcMainListener('get-profileSession', () => {
    const profileSession = store.get('profileSession');
    return profileSession;
  });
  ipcMainListenerSync('set-profileSession', data => {
    store.set('profileSession', data);
    return 'set-profileSession';
  });
  ipcMainListener('get-profileSessions', () => {
    const profileSessions = store.get('profileSessions');
    return profileSessions;
  });
  ipcMainListenerSync('set-profileSessions', data => {
    store.set('profileSessions', data);
    return 'set-profileSessions';
  });
  ipcMainListener('init-profiles', async ({ event }) => {
    const profiles = ['dev', 'qa', 'stage', 'prod'];
    // let existingProfiles: ProfileStorage = {};
    let existingProfiles: ConfigureProfile[] = [];
    let idx = 0;

    const data = fs.readFileSync(credentialsFilePath, 'utf8');
    for (const profile of profiles) {
      if (data.includes(`[${profile}]`)) {
        existingProfiles.push({
          idx: idx++, // idx 값 할당 후 증가
          profileName: profile, // 프로필 이름 추가
          accountId: '', // AWS 계정 ID 초기화
          roles: [], // 역할 리스트 초기화
        });
      }
    }
    // 초기 프로파일 리스트를 전송합니다.
    event.reply('init-profiles', successMessage(existingProfiles));
    // 오래 걸리는 작업을 처리합니다.
    for (const profile of existingProfiles) {
      const { accountId, roles } = await initProfile(profile.profileName);
      // 기존에 추가된 프로파일 정보를 업데이트합니다.
      profile.accountId = accountId;
      profile.roles = roles;
    }
    // 업데이트된 프로파일 리스트를 전송합니다.
    return existingProfiles;
  });

  ipcMainListener('add-profile', async ({ data }) => {
    const profileName = data.profileName;
    const credentialsContent = `[${profileName}]
aws_access_key_id=${data.accessKeyId}
aws_secret_access_key=${data.secretAccessKey}`;
    const configContent = `[profile ${profileName}]
region = ap-northeast-2
output = json`;
    let fileContent = fs.readFileSync(credentialsFilePath, 'utf8');
    if (fileContent.includes(profileName)) {
      await Promise.all([
        updateProfileInFile(credentialsFilePath, `[${profileName}]`, credentialsContent),
        updateProfileInFile(configFilePath, `[profile ${profileName}]`, `[profile ${profileName}]`),
      ]);
    } else {
      await Promise.all([
        appendProfileInFile(credentialsFilePath, `[${profileName}]`, credentialsContent),
        appendProfileInFile(configFilePath, `[profile ${profileName}]`, configContent),
      ]);
    }
    const { accountId, roles } = await initProfile(profileName);
    return { accountId, roles };
  });

  ipcMainListener('delete-profile', async ({ data }) => {
    await Promise.all([
      deleteProfileInFile(credentialsFilePath, `[${data}]`),
      deleteProfileInFile(configFilePath, `[profile ${data}]`),
    ]);
    return data;
  });

  ipcMainListener('update-profile', async ({ data }) => {
    const oldProfileName = data.oldProfileName;
    const profileName = data.profileName;
    const accessKeyId = data.accessKeyId;
    const secretAccessKey = data.secretAccessKey;

    // accessKeyId와 secretAccessKey의 존재 여부에 따라 credentialsContent 구성 변경
    let credentialsContent = `[${profileName}]`;
    if (accessKeyId && secretAccessKey) {
      credentialsContent += `
aws_access_key_id=${accessKeyId}
aws_secret_access_key=${secretAccessKey}`;
    }
    await Promise.all([
      updateProfileInFile(credentialsFilePath, `[${oldProfileName}]`, credentialsContent),
      updateProfileInFile(configFilePath, `[profile ${oldProfileName}]`, `[profile ${profileName}]`),
    ]);
    const { accountId, roles } = await initProfile(profileName);
    return {
      oldProfileName: profileName,
      newProfileData: {
        profileName,
        accountId,
        roles,
      },
    };
  });

  async function handleAssumeRole(data: AssumeRoleData) {
    const profileName = `${data.profileName}`;
    const tokenSuffix = `${data.tokenSuffix}`;
    const sessionProfileName = `${profileName}${tokenSuffix}`;
    const accountId = data.accountId;
    const role = data.role;
    const tokenCode = data?.tokenCode;
    const credentials = await getAwsCredentials(profileName);
    const config = { credentials };
    const getUser = await getUserName(config);
    if (!getUser || !getUser.User) {
      throw new Error('Failed to get user information');
    }
    const userName = getUser.User.UserName as string;
    let input: AssumeRoleInput = {
      RoleArn: '',
      RoleSessionName: '',
      DurationSeconds: 0,
    };
    if (tokenCode) {
      input = {
        RoleArn: `arn:aws:iam::${accountId}:role/${role}`,
        RoleSessionName: userName,
        DurationSeconds: 3600,
        SerialNumber: `arn:aws:iam::${accountId}:mfa/${userName}`,
        TokenCode: '123456', // 브라우저에서 입력한 값으로 변경해야 함
      };
    } else {
      input = {
        RoleArn: `arn:aws:iam::${accountId}:role/${role}`,
        RoleSessionName: userName,
        DurationSeconds: 3600,
      };
    }
    const assumeRoleResponse = await assumeRole(config, input);
    if (!assumeRoleResponse || !assumeRoleResponse.Credentials) {
      throw new Error('Failed to assume role');
    }
    const defaultCredentialsContent = `[default]
aws_access_key_id=${assumeRoleResponse.Credentials.AccessKeyId}
aws_secret_access_key=${assumeRoleResponse.Credentials.SecretAccessKey}
aws_session_token=${assumeRoleResponse.Credentials.SessionToken}`;
    const credentialsContent = `[${sessionProfileName}]
aws_access_key_id=${assumeRoleResponse.Credentials.AccessKeyId}
aws_secret_access_key=${assumeRoleResponse.Credentials.SecretAccessKey}
aws_session_token=${assumeRoleResponse.Credentials.SessionToken}`;
    const configContent = `[profile ${sessionProfileName}]
region = ap-northeast-2
output = json`;

    let fileContent = fs.readFileSync(credentialsFilePath, 'utf8');
    if (fileContent.includes(sessionProfileName)) {
      await updateProfileInFile(credentialsFilePath, `[${sessionProfileName}]`, credentialsContent);
    } else {
      await Promise.all([
        appendProfileInFile(credentialsFilePath, `[${sessionProfileName}]`, credentialsContent),
        appendProfileInFile(configFilePath, `[profile ${sessionProfileName}]`, configContent),
      ]);
    }
    if (fileContent.includes('[default]')) {
      await updateProfileInFile(credentialsFilePath, '[default]', defaultCredentialsContent);
    } else {
      await appendProfileInFile(credentialsFilePath, '[default]', defaultCredentialsContent);
    }
    return profileName;
  }
  ipcMainListener('assume-role', async ({ event, data }) => {
    const profileName = await handleAssumeRole(data);
    const nowString = getDate();
    setRepeater('10s', async () => {
      if (new Date().getTime() - new Date(nowString).getTime() >= 59 * 60 * 1000) {
        if (store.get('profileSession') === profileName) {
          await handleAssumeRole(data);
          return true;
        }
        event.reply('session-expired', successMessage(profileName));
        return false;
      }
      return true;
    });
    return profileName;
  });

  ipcMainListener('default-profile', async ({ data }) => {
    const profileName = `${data.profileName}`;
    const tokenSuffix = `${data.tokenSuffix}`;
    const sessionProfileName = `${profileName}${tokenSuffix}`;
    const credentials = await getAwsCredentials(sessionProfileName);
    const defaultCredentialsContent = `[default]
aws_access_key_id=${credentials.accessKeyId}
aws_secret_access_key=${credentials.secretAccessKey}
aws_session_token=${credentials.sessionToken}`;
    await updateProfileInFile(credentialsFilePath, '[default]', defaultCredentialsContent);
    return sessionProfileName;
  });
}
