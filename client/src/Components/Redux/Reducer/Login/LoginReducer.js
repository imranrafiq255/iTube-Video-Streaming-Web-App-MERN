import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  message: "",
  error: false,
};
const loginReducer = createReducer(initialState, (builder) => {
  builder.addCase("loginRequest", (state) => {
    state.loading = true;
  });
  builder.addCase("loginSuccessRequest", (state, action) => {
    state.loading = false;
    state.message = action.payload;
  });
  builder.addCase("loginFailureRequest", (state, action) => {
    state.loading = false;
    state.message = action.payload;
  });
});

export default loginReducer;
