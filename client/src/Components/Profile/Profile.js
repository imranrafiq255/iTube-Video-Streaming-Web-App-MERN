import React, { useEffect, useState } from "react";
import ProfileCover from "../../Assets/profile-cover.jpeg";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import UserImage from "../../Assets/user.png";
import Badge from "../../Assets/black-tick.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import loginAction from "../Redux/Actions/Login/LoginAction.js";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction.js";
import LoaderBars from "../Loader/LoaderBars.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [videosNavigator, setVideosNavigator] = useState(true);
  const [shortsNavigator, setShortsNavigator] = useState(false);
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout } =
    useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videosNavigationHandler = () => {
    if (videosNavigator) {
      setVideosNavigator(false);
      setShortsNavigator(true);
    } else {
      setVideosNavigator(true);
      setShortsNavigator(false);
    }
  };
  const shortsNavigationHandler = () => {
    if (shortsNavigator) {
      setShortsNavigator(false);
      setVideosNavigator(true);
    } else {
      setShortsNavigator(true);
      setVideosNavigator(false);
    }
  };
  useEffect(() => {
    if (user) {
      dispatch(loginAction(user));
    }
    dispatch(loadUserAction());
  }, [dispatch, user]);
  const { loadedUser, authenticated, loading } = useSelector(
    (state) => state.loadedUser
  );
  useEffect(() => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
    }
  });
  const playVideo = async (video) => {
    try {
      await axios.get(`/api/v1/video/videoviews/${video._id}`);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      navigate("/playvideo", { state: { video } });
    }
  };
  const shortClickHandler = () => {
    navigate("/shorts");
  };
  const logoutHandler = async () => {
    if (authenticated) {
      try {
        axios.get("/api/v1/user/logout/");
        logout();
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4">
        <Header />
        {loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <LoaderBars />
          </div>
        ) : (
          <div className="profile-container h-screen mt-7 w-full">
            <div className="cover-img w-full sm:w-10/12 m-auto">
              <img
                src={ProfileCover}
                alt=""
                className="w-full h-36 sm:h-40 lg:h-44 xl:h-48 2xl:h-56 object-fit rounded-lg"
              />
            </div>
            <div className="profile-channel-details-container flex flex-wrap w-full h-auto mt-4 justify-center">
              <div className="profile-channel-details w-full sm:w-10/12 lg:flex">
                <div className="user-profile-left w-full lg:w-3/12 xl:w-2/12  2xl:w-1/12 h-28 flex items-center">
                  <img
                    src={
                      authenticated && loadedUser
                        ? loadedUser?.currentUser?.userAvatar
                        : UserImage
                    }
                    alt=""
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
                  />
                </div>
                <div className="user-profile-right w-full lg:w-9/12 xl:w-10/12 2xl:w-11/12 ml-3 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-2  basis-4/6 items-center">
                      <h1 className="lg:text-4xl text-2xl font-bold">
                        {authenticated && loadedUser
                          ? loadedUser?.currentUser?.userChannel
                          : "No name"}
                      </h1>
                      <img
                        src={Badge}
                        alt=""
                        className="w-6 h-6 lg:w-8 lg:h-8"
                      />
                    </div>
                    {authenticated ? (
                      <div className="logout flex justify-end basis-2/6 mr-2">
                        <button
                          className=" bg-slate-800 text-white px-4 py-2 rounded-full"
                          onClick={logoutHandler}
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className=" h-10 flex items-center gap-2">
                    <h1 className="text-sm lg:text-lg">
                      {loadedUser &&
                        loadedUser?.currentUser?.subscribers.length +
                          " subscribers"}
                    </h1>
                    <div className="dot h-1 w-1 bg-slate-400 rounded-full"></div>
                    <h1 className="videos-count text-sm lg:text-lg">
                      {authenticated && loadedUser
                        ? loadedUser?.currentUser?.userVideos.length + " videos"
                        : "no videos"}
                    </h1>
                    <div className="dot h-1 w-1 bg-slate-400 rounded-full"></div>
                    <h1 className="videos-count text-sm lg:text-lg">
                      {authenticated && loadedUser
                        ? loadedUser?.currentUser?.userShorts.length + " shorts"
                        : "no shorts"}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="videos-shorts w-full sm:w-10/12 ml-6 flex items-center h-16 gap-4 ">
                <h1
                  className={`${
                    videosNavigator
                      ? "border-solid border-b-2 border-black font-bold"
                      : " text-slate-600"
                  } cursor-pointer text-xl`}
                  onClick={videosNavigationHandler}
                >
                  videos
                </h1>
                <h1
                  className={`${
                    shortsNavigator
                      ? "border-solid border-b-2 border-black font-bold"
                      : " text-slate-600"
                  } cursor-pointer text-xl`}
                  onClick={shortsNavigationHandler}
                >
                  shorts
                </h1>
              </div>
              <div className="w-full sm:w-10/12">
                <div className="line w-full h-0.5 bg-slate-200"></div>
              </div>
              <div
                className={`${
                  videosNavigator ? "" : "hidden"
                } videos-container w-full sm:w-10/12 flex flex-wrap mt-4 lg:mb-0 mb-14`}
              >
                {loadedUser &&
                Array.isArray(loadedUser?.currentUser?.userVideos) &&
                loadedUser?.currentUser?.userVideos.length > 0 ? (
                  loadedUser?.currentUser?.userVideos.map((video) => (
                    <div className="w-6/12 sm:w-4/12 lg:w-2/12 p-2">
                      <div className="video w-full h-auto">
                        <div className="video-thumbnail bg-transparent overflow-hidden object-cover relative">
                          <video
                            src={video.videoURL}
                            className="rounded cursor-pointer object-cover"
                            onClick={() => playVideo(video)}
                          ></video>
                          {video?.VideoThumbnail ? (
                            <img
                              src={video?.VideoThumbnail}
                              className="w-full h-full absolute top-0 rounded hover:cursor-pointer hover:bg-opacity-95 object-cover overflow-hidden cursor-pointer"
                              alt=""
                              onClick={() => playVideo(video)}
                            />
                          ) : (
                            ""
                          )}
                          <p className="absolute text-white text-sm bottom-2 right-2 lg:right-5">
                            {video?.videoDuration % 60 > 10
                              ? Math.floor(video?.videoDuration / 60) +
                                ":" +
                                Math.floor(video?.videoDuration % 60)
                              : Math.floor(video?.videoDuration / 60) +
                                ":0" +
                                Math.floor(video?.videoDuration % 60)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h1>No video</h1>
                  </div>
                )}
              </div>

              {/* shorts  */}
              <div
                className={`${
                  shortsNavigator ? "" : "hidden"
                } videos-container w-full sm:w-10/12 flex flex-wrap mt-4 lg:mb-0 mb-14`}
              >
                {Array.isArray(loadedUser?.currentUser?.userShorts) &&
                loadedUser?.currentUser?.userShorts.length > 0 ? (
                  loadedUser?.currentUser?.userShorts.map((short) => (
                    <div className="w-6/12 sm:w-4/12 lg:w-2/12 p-2">
                      <div className="video w-full h-auto">
                        <div className="bg-transparent overflow-hidden object-cover relative cursor-pointer">
                          <video
                            src={short.shortURL}
                            className="rounded"
                            autoPlay={true}
                            muted={true}
                            onClick={shortClickHandler}
                          ></video>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h1>No short</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
