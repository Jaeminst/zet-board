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