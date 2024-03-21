interface Settings {
  [profileName: string]: Setting;
}

interface Setting {
  [category: string]: {
    [field: string]: string | boolean;
  };
}
