import { join } from 'path';
import fs from 'fs';
import { homedir } from 'os';

interface AwsCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

// 자격 증명 파일 및 설정 파일 경로
const credentialsFilePath = join(homedir(), '.aws', 'credentials');

export async function getAwsCredentials(profile: string): Promise<AwsCredentials> {
  const content = fs.readFileSync(credentialsFilePath, { encoding: 'utf-8' });
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
      const matchSessionToken = line.match(/^aws_session_token\s*=\s*(.+)$/);
      if (matchAccessKey) {
        credentials = credentials || { accessKeyId: '', secretAccessKey: '' }; // 객체가 아직 없으면 생성
        credentials.accessKeyId = matchAccessKey[1];
      } else if (matchSecretKey) {
        credentials = credentials || { accessKeyId: '', secretAccessKey: '' }; // 객체가 아직 없으면 생성
        credentials.secretAccessKey = matchSecretKey[1];
      } else if (matchSessionToken) {
        credentials = credentials || { accessKeyId: '', secretAccessKey: '' }; // 객체가 아직 없으면 생성
        credentials.sessionToken = matchSessionToken[1]; // sessionToken을 저장합니다.
      }
    }
  }

  if (!credentials || !credentials.accessKeyId || !credentials.secretAccessKey) {
    throw new Error(`Credentials not found for profile: ${profile}`);
  }
  return credentials;
}
