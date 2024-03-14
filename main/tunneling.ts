import { ipcMainListener } from "./utils/ipc";
import Store from "./utils/store";
import { getAwsCredentials } from "./utils/credentials";
import { getInstanceId } from "./aws/ec2Client";
import { startSession, terminateSession } from "./aws/ssmClient";
import { spawn } from "child_process";
import { setRepeater } from "./utils/setTimer";
import { getDate } from "./utils/date";
import systeminformation from "systeminformation";

export function registerIpcTunneling(store: Store) {
  ipcMainListener('tunneling', async ({ data }: { data: TunnelingData }) => {
    const type = data.type;
    const address = data.address;
    const port = data.port;
    const tunneling = data.tunneling;
    const profileName = `${data.profileName}`;
    const sessionProfileName = `${data.profileName}${data.tokenSuffix}`;
    const credentials = await getAwsCredentials(sessionProfileName);
    const config = { credentials };
    if (type === 'database') {
      if (tunneling) {
        // 터널링 연결
        const databaseSettings = store.get('databaseSettings');
        const localPort = databaseSettings[profileName][address].localPort as string;
        const databaseTunnel = async () => {
          const tunnelingStore = store.get('tunneling') || {};
          if (!tunnelingStore[profileName]) {
              tunnelingStore[profileName] = {};
          };
          if (tunnelingStore[profileName]?.[address]) {
            await terminateSession(config, { SessionId: tunnelingStore[profileName][address] });
          };
          const instanceId = await getInstanceId(config, 'bastion-host')
          const startSessionResponse = await startSession(config, {
            Target: instanceId,
            DocumentName: "AWS-StartPortForwardingSessionToRemoteHost",
            Parameters: {
              "localPortNumber": [localPort],
              "host": [address],
              "portNumber": [port.toString()],
            },
          })
          const sessionId = startSessionResponse.SessionId;
          tunnelingStore[profileName][address] = sessionId;
          store.set('tunneling', tunnelingStore);
          spawn(
            `"C:/Program Files/Amazon/SessionManagerPlugin/bin/session-manager-plugin.exe"`,
            [
              `"${JSON.stringify(JSON.stringify(startSessionResponse))}"`,
              "ap-northeast-2",
              "StartSession",
              "default",
              `"${JSON.stringify(JSON.stringify({Target: instanceId}))}"`,
              "https://ssm.ap-northeast-2.amazonaws.com"
            ],
            { shell: true }
          );
        };
        await databaseTunnel();
        // 포트 상태를 확인하는 함수
        const checkPortStatus = async (port: string): Promise<boolean> => {
          const networkConnections = await systeminformation.networkConnections();
          return networkConnections.find((networkConnection) => {
              return networkConnection.localPort === String(port);
          }) !== undefined;
        };
        const nowString = getDate();
        setRepeater('10s', async () => {
          const tunnelingStore = store.get('tunneling');
          if (tunnelingStore[profileName]?.[address] && store.get('profileSession') === profileName || !(new Date().getTime() - new Date(nowString).getTime() >= 60 * 60 * 1000)) {
            if (!await checkPortStatus(localPort)) {
              await databaseTunnel();
            }
            return true;
          } else {
            const databaseSettings = store.get('databaseSettings');
            databaseSettings[profileName][address].tunneling = false;
            store.set('databaseSettings', databaseSettings);
            const tunnelingStore = store.get('tunneling');
            if (tunnelingStore[profileName] && tunnelingStore[profileName][address]) {
              await terminateSession(config, { SessionId: tunnelingStore[profileName][address] });
              delete tunnelingStore[profileName][address];
              store.set('tunneling', tunnelingStore);
            }
            return false;
          }
        });
        const status = {
          address,
          tunneling: true,
        };
        return status as TunnelingStatus;
      } else {
        // 터널링 종료
        const tunnelingStore = store.get('tunneling');
        if (tunnelingStore[profileName] && tunnelingStore[profileName][address]) {
          await terminateSession(config, { SessionId: tunnelingStore[profileName][address] });
          delete tunnelingStore[profileName][address];
          store.set('tunneling', tunnelingStore);
        }
        const databaseSettings = store.get('databaseSettings');
        const status = {
          address,
          tunneling: databaseSettings[profileName][address].tunneling,
        };
        return status as TunnelingStatus;
      }
    }
    return {};
  });
}