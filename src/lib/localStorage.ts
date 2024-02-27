export function getLocalStorageProfileList(): Profile[] {
  const data = localStorage.getItem('profileList');
  if (data) {
    const profilesObject: ProfileStorage = JSON.parse(data);
    return Object.entries(profilesObject).map(([profileName, profileData]) => ({
      profileName,
      ...profileData,
    }));
  }
  return [];
}

export function setLocalStorageProfileList(initProfiles: Profile[]) {
  const profilesObject: ProfileStorage = initProfiles.reduce((acc, profile) => {
    const { profileName, ...rest } = profile;
    acc[profileName] = rest;
    return acc;
  }, {} as ProfileStorage);
  localStorage.setItem('profileList', JSON.stringify(profilesObject));
}