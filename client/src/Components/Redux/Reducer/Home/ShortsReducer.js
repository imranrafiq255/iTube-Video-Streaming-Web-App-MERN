import { createReducer } from "@reduxjs/toolkit";

const initialValues = {
  shortLoading: false,
  shorts: null,
  error: null,
};
const shortsReducer = createReducer(initialValues, (builder) => {
  builder.addCase("shortsRequest", (state) => {
    state.shortLoading = true;
  });
  builder.addCase("shortsRequestSuccess", (state, action) => {
    state.shortLoading = false;
    state.shorts = action.payload;
  });
  builder.addCase("shortsRequestFailure", (state, action) => {
    state.shortLoading = false;
    state.error = action.payload;
  });
});

export default shortsReducer;
