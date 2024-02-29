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

export function getLocalStorageProfileSessions(): ProfileSession[] {
  const data = localStorage.getItem("profileSessions");
  if (data) {
    return JSON.parse(data);
  }
  return [];
}

export function setLocalStorageProfileSessions(profileSessions: ProfileSession[]) {
  localStorage.setItem("profileSessions", JSON.stringify(profileSessions));
}