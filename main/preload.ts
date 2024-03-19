// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';

const electronHandler = {
  setTitle: (title: string) => ipcRenderer.send('set-title', title),
  profile: {
    sendSync(channel: ipcProfile, ...args: string[]): string {
      return ipcRenderer.sendSync(channel, ...args);
    },
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
    removeListener: (channel: ipcProfile, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
    // 특정 채널의 모든 리스너 제거
    removeAllListeners: (channel: ipcProfile) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  database: {
    sendSync(channel: ipcDatabase, ...args: string[]) {
      ipcRenderer.sendSync(channel, ...args);
    },
    send(channel: ipcDatabase, ...args: string[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: ipcDatabase, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
    },
    once(channel: ipcDatabase, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) =>
        func(...args);
      ipcRenderer.once(channel, subscription);
    },
    // 특정 채널의 리스너 제거
    removeListener: (channel: ipcDatabase, func: (...args: any[]) => void) => {
      ipcRenderer.removeListener(channel, func);
    },
    // 특정 채널의 모든 리스너 제거
    removeAllListeners: (channel: ipcDatabase) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  tunneling: {
    send(channel: ipcTunneling, ...args: string[]) {
      ipcRenderer.send(channel, ...args);
    },
    once(channel: ipcTunneling, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) =>
        func(...args);
      ipcRenderer.once(channel, subscription);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
