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

export function ipcMainListenerSync(eventName: string, processLogic: (data: any) => string | object) {
  ipcMain.on(eventName, (event, request) => {
    try {
      const data = ipcParser(request);
      const replyMessage = processLogic(data);
      event.returnValue = successMessage(replyMessage);
    } catch (error) {
      event.returnValue = errorMessage(error);
    }
  });
}