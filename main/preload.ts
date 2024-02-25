// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type ipcProfile = 'init-profiles' | 'add-profile' | 'delete-profile'

const electronHandler = {
  profile: {
    send(channel: ipcProfile, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: ipcProfile, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
  },
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
