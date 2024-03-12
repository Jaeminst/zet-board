import { ipcMainListener } from "./utils/ipc";
import Store from "./utils/store";
import { getAwsCredentials } from "./utils/credentials";
import { getInstanceId } from "./aws/ec2Client";
import { startSession, terminateSession } from "./aws/ssmClient";
import { spawn } from "child_process";
import net from 'net';
import { setRepeater } from "./utils/setTimer";
import { getDate } from "./utils/date";

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
        const databaseTunnel = async () => {
          const instanceId = await getInstanceId(config, 'bastion-host')
          const databaseSettings = store.get('databaseSettings');
          const startSessionResponse = await startSession(config, {
            Target: instanceId, // required
            DocumentName: "AWS-StartPortForwardingSessionToRemoteHost",
            Parameters: { // SessionManagerParameters
              "localPortNumber": [ // SessionManagerParameterValueList
                databaseSettings[profileName][address].localPort,
              ],
              "host": [ // SessionManagerParameterValueList
                address,
              ],
              "portNumber": [ // SessionManagerParameterValueList
                port.toString(),
              ],
            },
          })
          const sessionId = startSessionResponse.SessionId;
          const tunnelingStore = store.get('tunneling') || {};
          if (!tunnelingStore[profileName]) {
              tunnelingStore[profileName] = {};
          }
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
        const host = '127.0.0.1'; // 호스트 주소
        const client = net.createConnection({ port, host });
        client.on('error', async () => {
          const tunnelingStore = store.get('tunneling');
          await terminateSession(config, { SessionId: tunnelingStore[profileName][address] });
          await databaseTunnel();
        });
        const nowString = getDate();
        setRepeater('1m', async () => {
          const tunnelingStore = store.get('tunneling');
          if (tunnelingStore[profileName]?.[address] && store.get('profileSession') === profileName || !(new Date().getTime() - new Date(nowString).getTime() >= 60 * 60 * 1000)) {
            return true;
          } else {
            client.end();
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