import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  authenticated: false,
  user: null,
  error: null,
};
const loadUserReducer = createReducer(initialState, (builder) => {
  builder.addCase("loadUserRequest", (state) => {
    state.loading = true;
    state.authenticated = false;
  });
  builder.addCase("loadUserRequestSuccess", (state, action) => {
    state.loading = false;
    state.authenticated = true;
    state.loadedUser = action.payload;
  });
  builder.addCase("loadUserRequestFailure", (state, action) => {
    state.loading = false;
    state.authenticated = false;
    state.error = action.payload;
  });
});

export default loadUserReducer;
