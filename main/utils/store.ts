import electron from 'electron';
import { join } from 'path';
import fs from 'fs';

export default class Store {
  [x: string]: any;
  constructor(opts: { configName: string; defaults: any }) {
    // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
    // app.getPath('userData') will return a string of the user's app data directory path.
    const userDataPath = electron.app.getPath('userData');
    // We'll use the `configName` property to set the file name and path.join to bring it all together as a string
    this.path = join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }

  // This will just return the property on the `data` object
  get(key: string | number) {
    return this.data[key];
  }

  // ...and this will set it
  set(key: string | number, val: any) {
    this.data[key] = val;
    // Wait, I thought using the node.js' synchronous APIs was bad form?
    // We're not writing a server so there's not nearly the same IO demand on the process
    // Also if we used an async API and our app was quit before the asynchronous write had a chance to complete,
    // we might lose that data. Note that in a real app, we would try/catch this.
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: string, defaults: any) {
  try {
    const data = fs.readFileSync(filePath, { encoding: 'utf8' });
    return JSON.parse(data);
  } catch (error) {
    return defaults;
  }
}
