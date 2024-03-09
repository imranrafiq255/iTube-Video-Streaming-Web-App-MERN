import React, { useEffect, useState } from "react";
import ProfileCover from "../../Assets/profile-cover.jpeg";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import Boy from "../../Assets/boy.jpg";
import Badge from "../../Assets/badge.png";
import LoaderBars from "../Loader/LoaderBars.js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction.js";
import { Toaster } from "react-hot-toast";
import {
  handleShowSuccessToast,
  handleShowFailureToast,
} from "../../Components/ToastMessages/ToastMessage";
const Account = () => {
  const [videosNavigator, setVideosNavigator] = useState(true);
  const [shortsNavigator, setShortsNavigator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subscribeHandler = async (video) => {
    try {
      const response = await axios.get(
        `/api/v1/user/subscribe/${loadedUser.currentUser._id}/${id}`
      );
      dispatch(loadUserAction());
      searchUser();
      handleShowSuccessToast(response.data.message);
    } catch (error) {
      console.log("Subscribe error of " + error.response.data.message);
      handleShowFailureToast(error.response.data.message);
    }
  };
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
  const searchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/user/finduser/${id}`);
      setUser(await response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    searchUser();
  }, []);

  const playVideo = async (video) => {
    try {
      await axios.get(`/api/v1/video/videoviews/${video._id}`);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      navigate("/playvideo", { state: { video } });
    }
  };

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const { loadedUser } = useSelector((state) => state.loadedUser);
  const shortClickHandler = () => {
    navigate("/shorts");
  };
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4">
        <Header />
        <Toaster />
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
              <div
                className={`${
                  loadedUser && id && loadedUser?.currentUser?._id === id
                    ? " items-center"
                    : ""
                } profile-channel-details w-full sm:w-10/12 lg:flex`}
              >
                <div className="user-profile-left w-full lg:w-3/12 xl:w-2/12  2xl:w-1/12 h-28 flex items-center">
                  <img
                    src={user ? user.user?.userAvatar : Boy}
                    alt=""
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full"
                  />
                </div>
                <div className="user-profile-right w-full lg:w-9/12 xl:w-10/12 2xl:w-11/12 ml-3">
                  <div className="flex items-center gap-2">
                    <h1 className="lg:text-4xl text-2xl font-bold">
                      {user ? user.user?.userChannel : "No name"}
                    </h1>
                    <img src={Badge} alt="" className="w-6 h-6 lg:w-8 lg:h-8" />
                  </div>
                  <div className=" h-10 flex items-center gap-2">
                    <h1 className="text-sm lg:text-lg">
                      {user
                        ? user.user?.subscribers.length + " subscribers"
                        : "no subscriber"}
                    </h1>
                    <div className="dot h-1 w-1 bg-slate-400 rounded-full"></div>
                    <h1 className="videos-count text-sm lg:text-lg">
                      {user
                        ? user.user?.userVideos.length + " videos"
                        : "no videos"}
                    </h1>
                    <div className="dot h-1 w-1 bg-slate-400 rounded-full"></div>
                    <h1 className="videos-count text-sm lg:text-lg">
                      {user
                        ? user.user?.userShorts.length + " shorts"
                        : "no shorts"}
                    </h1>
                  </div>
                  {loadedUser && loadedUser?.currentUser?._id === id ? (
                    ""
                  ) : (
                    <div className="subscribe-channel">
                      {user &&
                      user?.user?.subscribers.includes(
                        loadedUser?.currentUser?._id
                      ) ? (
                        <div
                          className={`channel-subscribe-button transition-opacity duration-700 ease`}
                        >
                          <button
                            className=" bg-slate-200 text-black md:px-6 md:py-1.5 px-4 py-0.5 rounded-3xl md:mt-2"
                            onClick={subscribeHandler}
                          >
                            Subscribed
                          </button>
                        </div>
                      ) : (
                        <div className={`channel-subscribe-button`}>
                          <button
                            className=" bg-black text-white md:px-6 md:py-1.5 px-4 py-0.5 rounded-3xl md:mt-2"
                            onClick={subscribeHandler}
                          >
                            Subscribe
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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
                {user &&
                Array.isArray(user.user?.userVideos) &&
                user.user?.userVideos.length > 0 ? (
                  user.user?.userVideos.map((video) => (
                    <div className="w-6/12 sm:w-4/12 lg:w-2/12 p-2">
                      <div className="video w-full h-auto">
                        <div className="video-thumbnail bg-transparent overflow-hidden relative rounded">
                          <video
                            src={video.videoURL}
                            className="rounded h-32 object-cover"
                            onClick={() => playVideo(video)}
                          ></video>
                          <img
                            src={video.videoThumbnail}
                            className="w-full h-full absolute top-0 rounded hover:cursor-pointer hover:bg-opacity-95 object-cover overflow-hidden"
                            alt=""
                            onClick={() => playVideo(video)}
                          />
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
                  <div className="h-full w-full flex justify-center items-center">
                    <h1 className=" text-xl">No videos</h1>
                  </div>
                )}
              </div>

              {/* shorts  */}
              <div
                className={`${
                  shortsNavigator ? "" : "hidden"
                } videos-container w-full sm:w-10/12 flex flex-wrap mt-4 lg:mb-0 mb-14`}
              >
                {user &&
                Array.isArray(user.user?.userShorts) &&
                user.user?.userShorts.length > 0 ? (
                  user.user?.userShorts.map((short) => (
                    <div className="w-6/12 sm:w-4/12 lg:w-2/12 p-2">
                      <div className="video w-full h-auto">
                        <div className="bg-transparent overflow-hidden object-cover relative">
                          <video
                            src={short.shortURL}
                            className="rounded"
                            autoPlay={true}
                            muted={true}
                            loop={true}
                            onClick={shortClickHandler}
                          ></video>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <h1 className=" text-xl">No videos</h1>
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

export default Account;
