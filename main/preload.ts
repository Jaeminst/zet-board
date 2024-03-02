// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const electronHandler = {
  profile: {
    send(channel: ipcProfile, ...args: string[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: ipcProfile, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
    },
    once(channel: ipcProfile, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) =>
        func(...args);
      ipcRenderer.once(channel, subscription);
    },
    // 특정 채널의 리스너 제거
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
    // 특정 채널의 모든 리스너 제거
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
