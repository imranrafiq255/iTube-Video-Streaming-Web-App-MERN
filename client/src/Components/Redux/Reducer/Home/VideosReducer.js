import { createReducer } from "@reduxjs/toolkit";

const initialValues = {
  videoLoading: false,
  videos: null,
  error: null,
};
const videosReducer = createReducer(initialValues, (builder) => {
  builder.addCase("videosRequest", (state) => {
    state.videoLoading = true;
  });
  builder.addCase("videosRequestSuccess", (state, action) => {
    state.videoLoading = false;
    state.videos = action.payload;
  });
  builder.addCase("videosRequestFailure", (state, action) => {
    state.videoLoading = false;
    state.error = action.payload;
  });
});

export default videosReducer;
