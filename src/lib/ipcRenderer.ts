import { ipcParser } from "./ipcParser";

export default class IpcRenderer {
  constructor() {
    // 초기화 코드가 필요하면 여기에 작성
  }

  static removeAllListeners(listener: ipcProfile | ipcDatabase) {
    if (ipcProfileEvents.includes(listener as ipcProfile)) {
      window.electron.profile.removeAllListeners(listener as ipcProfile);
      return;
    }
    if (ipcDatabaseEvents.includes(listener as ipcDatabase)) {
      window.electron.database.removeAllListeners(listener as ipcDatabase);
      return;
    }
  }

  // Profile
  static getProfileList(callback: (data: Profile[]) => void) {
    window.electron.profile.send('get-profileList');
    window.electron.profile.once('get-profileList', (profileListString: string) => {
      const data = ipcParser(profileListString) as Profile[];
      callback(data);
    });
  }

  static setProfileList(profileList: Profile[]) {
    window.electron.profile.sendSync('set-profileList', JSON.stringify(profileList));
  }

  static addProfile(newProfile: ProfileCredentials, callback: (data: ConfigureProfile) => void) {
    window.electron.profile.send('add-profile', JSON.stringify(newProfile));
    window.electron.profile.once('add-profile', (addProfileString: string) => {
      const data = ipcParser(addProfileString) as ConfigureProfile;
      callback(data);
    });
  }

  static updateProfile(editProfile: ProfileCredentials, callback: (data: EditConfigureProfile) => void) {
    window.electron.profile.send('update-profile', JSON.stringify(editProfile));
    window.electron.profile.once('update-profile', (editProfileString: string) => {
      const data = ipcParser(editProfileString) as EditConfigureProfile;
      callback(data);
    });
  }

  static deleteProfile(profileName: string, callback: (data: string) => void) {
    window.electron.profile.send('delete-profile', profileName);
    window.electron.profile.once('delete-profile', (deleteProfileString: string) => {
      const data = ipcParser(deleteProfileString) as string;
      callback(data);
    });
  }

  static getProfileSession(callback: (data: string) => void) {
    window.electron.profile.send('get-profileSession');
    window.electron.profile.once('get-profileSession', (profileSessionString: string) => {
      const data = ipcParser(profileSessionString) as string;
      callback(data);
    });
  }

  static setProfileSession(profileSession: string) {
    window.electron.profile.sendSync('set-profileSession', profileSession);
  }

  static getProfileSessions(callback: (data: ProfileSession[]) => void) {
    window.electron.profile.send('get-profileSessions');
    window.electron.profile.once('get-profileSessions', (profileSessionsString: string) => {
      const data = ipcParser(profileSessionsString) as ProfileSession[];
      callback(data);
    });
  }

  static setProfileSessions(profileSessions: ProfileSession[]) {
    window.electron.profile.sendSync('set-profileSessions', JSON.stringify(profileSessions));
  }

  static assumeRole(profileSession: string, selectedProfile: Profile, callback: (data: string) => void) {
    window.electron.profile.send('assume-role', JSON.stringify({
      profileName: profileSession,
      tokenSuffix: `_token`,
      accountId: selectedProfile.accountId,
      role: selectedProfile.selectRole,
    }));
    window.electron.profile.once('assume-role', (profileSession: string) => {
      const data = ipcParser(profileSession) as string;
      callback(data);
    });
  }

  static defaultProfile(profileSession: string) {
    window.electron.profile.sendSync('default-profile', JSON.stringify({
      profileName: profileSession,
      tokenSuffix: `_token`,
    }));
  }

  static sessionExpired(callback: (data: string) => void) {
    window.electron.profile.on('session-expired', (profileNameString) => {
      const data = ipcParser(profileNameString) as string;
      callback(data);
    });
  }

  // Database
  static getDatabaseList(callback: (data: Databases) => void) {
    window.electron.database.send('get-databaseList');
    window.electron.database.once('get-databaseList', (databaseListString: string) => {
      const data = ipcParser(databaseListString) as Databases;
      callback(data);
    });
  }

  static setDatabaseList(initDatabases: Databases) {
    window.electron.database.sendSync('set-databaseList', JSON.stringify(initDatabases));
  }

  static getDatabaseSettings(callback: (data: DatabaseSettings) => void) {
    window.electron.database.send('get-databaseSettings');
    window.electron.database.once('get-databaseSettings', (databaseSettingsString: string) => {
      const data = ipcParser(databaseSettingsString) as DatabaseSettings;
      callback(data);
    });
  }

  static setDatabaseSettings(databaseSettings: DatabaseSettings) {
    window.electron.database.sendSync('set-databaseSettings', JSON.stringify(databaseSettings));
  }

  // tunneling
  static tunneling(tunnelingData: TunnelingData, profileName: string, callback: (data: TunnelingStatus) => void) {
    window.electron.tunneling.send('tunneling', JSON.stringify({
      type: tunnelingData.type,
      address: tunnelingData.address,
      port: tunnelingData.port,
      profileName,
      tokenSuffix: `_token`,
      tunneling: tunnelingData.tunneling,
    }));
    window.electron.tunneling.once('tunneling', (status: string) => {
      const data = ipcParser(status) as TunnelingStatus;
      callback(data);
    });
  }
}
