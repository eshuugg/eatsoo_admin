import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  userData: null, // Corrected typo: userLoginDta -> userLoginData
  roleData: null,
  roleUserData: null,
  createUserData: null,
  updateUserData: null,
  activeDeactiveUserData: null,
  userDataLoading: false, // Corrected typo: userLoginDtaLoading -> userLoginDataLoading
  userDataError: null, // Corrected typo: userLoginDtaError -> userLoginDataError
};

export const userDataSlice = createSlice({
  name: "userLoginDetails",
  initialState: initialState,
  reducers: {
    userLoading: (state) => {
      state.userData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
    userSuccess: (state, { payload }) => {
      state.userData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    userError: (state, { payload }) => {
      state.userData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    roleSuccess: (state, { payload }) => {
      state.roleData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    roleError: (state, { payload }) => {
      state.roleData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    roleLoading: (state) => {
      state.roleData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
    roleUserSuccess: (state, { payload }) => {
      state.roleUserData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    roleUserError: (state, { payload }) => {
      state.roleUserData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    roleUserLoading: (state) => {
      state.roleUserData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
    createUserSuccess: (state, { payload }) => {
      state.createUserData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    createUserError: (state, { payload }) => {
      state.createUserData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    createUserLoading: (state) => {
      state.createUserData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
    updateUserSuccess: (state, { payload }) => {
      state.updateUserData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    updateUserError: (state, { payload }) => {
      state.updateUserData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    updateUserLoading: (state) => {
      state.updateUserData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
    activeDeactiveUserSuccess: (state, { payload }) => {
      state.activeDeactiveUserData = payload;
      state.userDataLoading = false;
      state.userDataError = null;
    },
    activeDeactiveUserError: (state, { payload }) => {
      state.activeDeactiveUserData = null;
      state.userDataLoading = false;
      state.userDataError = payload;
    },
    activeDeactiveUserLoading: (state) => {
      state.activeDeactiveUserData = null;
      state.userDataLoading = true;
      state.userDataError = null;
    },
  },
});

// Export actions
export const {
  userLoading,
  userSuccess,
  userError,
  roleSuccess,
  roleError,
  roleLoading,
  roleUserSuccess,
  roleUserError,
  roleUserLoading,
  createUserSuccess,
  createUserError,
  createUserLoading,
  updateUserSuccess,
  updateUserError,
  updateUserLoading,
  activeDeactiveUserSuccess,
  activeDeactiveUserError,
  activeDeactiveUserLoading
} =
  userDataSlice.actions;

// Export reducer
export default userDataSlice.reducer;

// Async action for user login
export const userLogin = (userDetails) => async (dispatch) => {
  console.log('userDetails', userDetails)
  try {
    dispatch(userLoading()); // Set loading state
    const { data } = await axiosInstance.post(`user/login`, userDetails);

    if (data) {
      dispatch(userSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(userError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    dispatch(userError(err.message || "Login failed")); // Dispatch error action
  }
};


export const getRoles = () => async (dispatch) => {
  try {
    dispatch(roleLoading()); // Set loading state
    const { data } = await axiosInstance.get(`user/roles`);

    if (data) {
      dispatch(roleSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(roleError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    dispatch(roleError(err.message || "Login failed")); // Dispatch error action
  }
};

export const getRoleUsers = (role) => async (dispatch) => {
  try {
    dispatch(roleUserLoading()); // Set loading state
    const { data } = await axiosInstance.get(`user/by-role/${role}`);

    if (data) {
      dispatch(roleUserSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(roleUserError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    dispatch(roleUserError(err.message || "Login failed")); // Dispatch error action
  }
};

export const createUser = (dta) => async (dispatch) => {
  try {
    dispatch(createUserLoading()); // Set loading state
    const { data } = await axiosInstance.post(`user/create`, dta);

    if (data) {
      dispatch(createUserSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(createUserError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    console.log('err', err)
    return err;
    dispatch(createUserError(err.message || "Login failed")); // Dispatch error action
  }
};

export const updateUser = (dta) => async (dispatch) => {
  try {
    dispatch(updateUserLoading()); // Set loading state
    const { data } = await axiosInstance.post(`user/update/${dta?.userId}`, dta?.userData);

    if (data) {
      dispatch(updateUserSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(updateUserError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    dispatch(updateUserError(err.message || "Login failed")); // Dispatch error action
  }
};

export const activeDeactiveUser = (dta) => async (dispatch) => {
  console.log('dta', dta)
  try {
    dispatch(activeDeactiveUserLoading()); // Set loading state
    const { data } = await axiosInstance.post(`user/user-status/${dta?.userId}`, {loginId:dta?.loginId});

    if (data) {
      dispatch(activeDeactiveUserSuccess(data)); // Dispatch success action
      return data; // Return data for further processing (if needed)
    } else {
      dispatch(activeDeactiveUserError("Login failed: No data received")); // Dispatch error action
    }
  } catch (err) {
    console.log('err', err)
    return err;
    dispatch(activeDeactiveUserError(err.message || "Login failed")); // Dispatch error action
  }
};