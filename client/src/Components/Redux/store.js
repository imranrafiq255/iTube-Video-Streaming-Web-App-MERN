import { configureStore } from "@reduxjs/toolkit";
import videosReducer from "./Reducer/Home/VideosReducer";
import loginReducer from "./Reducer/Login/LoginReducer";
import loadUserReducer from "./Reducer/Login/LoadUserReducer";
import shortsReducer from "./Reducer/Home/ShortsReducer";

const store = configureStore({
  reducer: {
    videos: videosReducer,
    shorts: shortsReducer,
    login: loginReducer,
    loadedUser: loadUserReducer,
  },
});

export default store;
