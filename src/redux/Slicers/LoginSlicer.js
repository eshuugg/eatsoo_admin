import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../axiosInstance";

const initialState = {
  userLoginData: null,
  userLoginDataLoading: false,
  userLoginDataError: null,
};

export const userLoginDataSlice = createSlice({
  name: "userLoginDetails",
  initialState,
  reducers: {
    userLoginLoading: (state) => {
      state.userLoginData = null;
      state.userLoginDataLoading = true;
      state.userLoginDataError = null;
    },
    userLoginSuccess: (state, { payload }) => {
      state.userLoginData = payload;
      state.userLoginDataLoading = false;
      state.userLoginDataError = null;
    },
    userLoginError: (state, { payload }) => {
      state.userLoginData = null;
      state.userLoginDataLoading = false;
      state.userLoginDataError = payload;
    },
    userLogout: (state) => {
      // Reset state on logout
      return initialState;
    },
  },
});

// Export actions
export const { userLoginLoading, userLoginSuccess, userLoginError, userLogout } =
  userLoginDataSlice.actions;

// Export reducer
export default userLoginDataSlice.reducer;

// Async action for user login
export const userLogin = (userDetails) => async (dispatch) => {
  try {
    dispatch(userLoginLoading());
    const { data } = await axiosInstance.post(`user/login`, userDetails);

    if (data) {
      dispatch(userLoginSuccess(data));
      return data;
    } else {
      dispatch(userLoginError("Login failed: No data received"));
    }
  } catch (err) {
    dispatch(userLoginError(err.message || "Login failed"));
  }
};
