// 액션 타입
export enum ProfileActionTypes {
  SelectRole = 'SELECT_ROLE',
  SetProfileList = 'SET_PROFILE_LIST',
  AddProfile = 'ADD_PROFILE',
  UpdateProfile = 'UPDATE_PROFILE',
  DeleteProfile = 'DELETE_PROFILE',
  SwapProfileIdxUp = 'SWAP_PROFILE_IDX_UP',
  SwapProfileIdxDown = 'SWAP_PROFILE_IDX_DOWN',
}

// 액션 인터페이스
export interface SelectRoleAction {
  type: ProfileActionTypes.SelectRole;
  payload: { idx: number; role: string };
}

export interface SetProfileAction {
  type: ProfileActionTypes.SetProfileList;
  payload: Profile[];
}

export interface AddProfileAction {
  type: ProfileActionTypes.AddProfile;
  payload: Profile;
}

export interface UpdateProfileAction {
  type: ProfileActionTypes.UpdateProfile;
  payload: {
    oldProfileName: string;
    newProfileData: {
      profileName: string;
      accountId: string;
      roles: string[];
    };
  };
}

export interface DeleteProfileAction {
  type: ProfileActionTypes.DeleteProfile;
  payload: string;
}

export interface SwapProfileIdxAction {
  type: ProfileActionTypes.SwapProfileIdxUp | ProfileActionTypes.SwapProfileIdxDown;
  payload: number;
}

export type ProfileAction =
  | SelectRoleAction
  | SetProfileAction
  | AddProfileAction
  | UpdateProfileAction
  | DeleteProfileAction
  | SwapProfileIdxAction;
