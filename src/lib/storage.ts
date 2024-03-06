export function getLocalStorageProfileList(): Profile[] {
  const data = localStorage.getItem("profileList");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export function setLocalStorageProfileList(initProfiles: Profile[]) {
  localStorage.setItem("profileList", JSON.stringify(initProfiles));
}

export function getSessionStorageProfileSessions(): ProfileSession[] {
  const data = sessionStorage.getItem("profileSessions");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export function setSessionStorageProfileSessions(profileSessions: ProfileSession[]) {
  sessionStorage.setItem("profileSessions", JSON.stringify(profileSessions));
}

export function getLocalStorageDatabaseList(): Databases {
  const data = localStorage.getItem("databaseList");
  if (data) {
    return JSON.parse(data);
  }
  return {};
}

export function setLocalStorageDatabaseList(initDatabases: Databases) {
  localStorage.setItem("databaseList", JSON.stringify(initDatabases));
}

export function getLocalStorageDatabaseSettings(): DatabaseSettings {
  const data = localStorage.getItem("databaseSettings");
  if (data) {
    return JSON.parse(data);
  }
  return {};
}

export function setLocalStorageDatabaseSettings(initDatabases: DatabaseSettings) {
  localStorage.setItem("databaseSettings", JSON.stringify(initDatabases));
}
