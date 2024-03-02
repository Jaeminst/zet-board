import { ElectronHandler } from "../preload";

declare global {
  interface Window {
    electron: ElectronHandler;
  }
}

export {};
