import { ipcMain } from 'electron';
import { successMessage, errorMessage } from './reply';

export function ipcParser(request: string) {
  let parsedData;
  try {
    parsedData = JSON.parse(request);
  } catch {
    parsedData = request;
  }
  return parsedData;
}

export async function ipcMainListener(eventName: string, processLogic: ({ data, event }: {data: any, event: Electron.IpcMainEvent}) => Promise<string | object>) {
  ipcMain.on(eventName, async (event, request) => {
    try {
      const data = ipcParser(request);
      const replyMessage = await processLogic({ data, event });
      event.reply(eventName, successMessage(replyMessage));
    } catch (error) {
      event.reply(eventName, errorMessage(error));
    }
  });
}