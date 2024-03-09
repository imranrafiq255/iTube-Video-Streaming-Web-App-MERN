import React, { useRef, useState, useEffect } from "react";
import "./Shorts.css";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import UnmutedSpeaker from "../../Assets/unmuted-speaker.png";
import MutedSpeaker from "../../Assets/muted-speaker.png";
import VideoPlayBtn from "../../Assets/video-play-icon.png";
import VideoPauseBtn from "../../Assets/pause-button.png";
import Like from "../../Assets/like.png";
import Liked from "../../Assets/liked.png";
import Dislike from "../../Assets/dislike.png";
import Disliked from "../../Assets/disliked.png";
import ThreeDots from "../../Assets/three-dots.png";
import Share from "../../Assets/share.png";
import Download from "../../Assets/download.png";
import { useSelector, useDispatch } from "react-redux";
import shortsLoaderAction from "../Redux/Actions/Home/ShortsAction";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";
import {
  handleShowSuccessToast,
  handleShowFailureToast,
} from "../../Components/ToastMessages/ToastMessage";
import loginAction from "../Redux/Actions/Login/LoginAction";
import LoaderCircles from "../Loader/LoaderCircles";
const Shorts = () => {
  const [optionIndex, setOptionIndex] = useState(-1);
  const videoRefs = useRef([]);
  const optionsRefs = useRef([]);
  const playBtnRefs = useRef([]);
  const speakerBtnRefs = useRef([]);
  const subsBtnRefs = useRef([]);
  const likesRefs = useRef([]);
  const dislikesRefs = useRef([]);
  const downloadRefs = useRef([]);
  const shareRefs = useRef([]);
  const bigHeartRefs = useRef([]);
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  useEffect(() => {
    dispatch(shortsLoaderAction());
    dispatch(loadUserAction());
  }, []);
  const { shorts, shortLoading } = useSelector((state) => state.shorts);
  const { loadedUser, authenticated, loading } = useSelector(
    (state) => state.loadedUser
  );
  let tempPlay = true;
  const dispatch = useDispatch();
  const shortController = (index) => {
    if (tempPlay) {
      playBtnRefs[index].src = VideoPlayBtn;
      videoRefs[index].pause();
      tempPlay = false;
    } else {
      playBtnRefs[index].src = VideoPauseBtn;
      videoRefs[index].play();
      tempPlay = true;
    }
  };

  const shortOptionsHandler = (index, eventType) => {
    if (eventType === "mouseenter") {
      setOptionIndex(index);
    } else if (eventType === "mouseleave") {
      setOptionIndex(-1);
    }
  };
  let tempSpeaker = true;
  const speakerHandler = async (index, short) => {
    if (tempSpeaker) {
      speakerBtnRefs[index].src = UnmutedSpeaker;
      videoRefs[index].muted = false;
      tempSpeaker = false;
      try {
        await axios.get(`/api/v1/short/viewshort/${short._id}`);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } else {
      speakerBtnRefs[index].src = MutedSpeaker;
      videoRefs[index].muted = true;
      tempSpeaker = true;
    }
  };
  const shortClickHandler = (index) => {
    if (tempPlay) {
      playBtnRefs[index].src = VideoPlayBtn;
      videoRefs[index].pause();
      tempPlay = false;
    } else {
      playBtnRefs[index].src = VideoPauseBtn;
      videoRefs[index].play();
      tempPlay = true;
    }
  };
  const subscribeHandler = async (short) => {
    try {
      const response = await axios.get(
        `/api/v1/user/subscribe/${loadedUser.currentUser._id}/${short?.shortUploadedBy._id}`
      );
      dispatch(loadUserAction());
      handleShowSuccessToast(response.data.message);
      callingLoadShortsApi();
    } catch (error) {
      console.log("Subscribe error of " + error.response.data.message);
    }
  };
  const callingLoadShortsApi = async () => {
    dispatch(shortsLoaderAction());
  };

  const likeHandler = async (index, short) => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
      return;
    }
    if (
      likesRefs[index].getAttribute("data-custom-like-value") === "unliked" &&
      dislikesRefs[index].getAttribute("data-custom-dislike-value") ===
        "disliked"
    ) {
      likesRefs[index].src = Liked;
      dislikesRefs[index].src = Dislike;
      bigHeartRefs[index].src = Liked;
      bigHeartRefs[index].style.display = "block";
      setTimeout(() => {
        bigHeartRefs[index].src = "";
        bigHeartRefs[index].style.display = "none";
      }, 2000);

      try {
        await axios.get(`/api/v1/short/likeshort/${short?._id}`);
        handleShowSuccessToast("You liked the short");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
      return;
    } else if (
      likesRefs[index].getAttribute("data-custom-like-value") === "liked"
    ) {
      likesRefs[index].src = Like;
      try {
        await axios.get(`/api/v1/short/likeshort/${short?._id}`);
        handleShowSuccessToast("You unliked the short");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    } else if (
      likesRefs[index].getAttribute("data-custom-like-value") === "unliked"
    ) {
      likesRefs[index].src = Liked;
      bigHeartRefs[index].src = Liked;
      bigHeartRefs[index].style.display = "block";
      setTimeout(() => {
        bigHeartRefs[index].src = "";
        bigHeartRefs[index].style.display = "none";
      }, 2000);
      try {
        await axios.get(`/api/v1/short/likeshort/${short?._id}`);
        handleShowSuccessToast("You liked the video");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    }
  };
  const dislikeHandler = async (index, short) => {
    if (
      likesRefs[index].getAttribute("data-custom-like-value") === "liked" &&
      dislikesRefs[index].getAttribute("data-custom-dislike-value") ===
        "undisliked"
    ) {
      likesRefs[index].src = Like;
      dislikesRefs[index].src = Disliked;
      try {
        await axios.get(`/api/v1/short/dislikeshort/${short?._id}`);
        handleShowSuccessToast("You disliked the short");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    } else if (
      dislikesRefs[index].getAttribute("data-custom-dislike-value") ===
      "disliked"
    ) {
      dislikesRefs[index].src = Dislike;

      try {
        await axios.get(`/api/v1/short/dislikeshort/${short?._id}`);
        handleShowSuccessToast("You undisliked the short");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    } else if (
      dislikesRefs[index].getAttribute("data-custom-dislike-value") ===
      "undisliked"
    ) {
      dislikesRefs[index].src = Disliked;

      try {
        await axios.get(`/api/v1/short/dislikeshort/${short?._id}`);
        handleShowSuccessToast("You disliked the short");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    }
  };
  const bigHeartDblClickHandler = async (index, short, isLiked) => {
    bigHeartRefs[index].src = Liked;
    bigHeartRefs[index].style.display = "block";
    likesRefs[index].src = Liked;

    if (!isLiked) {
      try {
        await axios.get(`/api/v1/short/likeshort/${short?._id}`);
        handleShowSuccessToast("You liked the video");
        callingLoadShortsApi();
      } catch (error) {
        handleShowFailureToast(error.response.data.message);
      }
    }
    if (
      likesRefs[index].getAttribute("data-custom-like-value") === "liked" &&
      dislikesRefs[index].getAttribute("data-custom-dislike-value") ===
        "disliked"
    ) {
      dislikesRefs[index].src = Dislike;
    }
    setTimeout(() => {
      bigHeartRefs[index].src = "";
      bigHeartRefs[index].style.display = "none";
    }, 2000);
  };
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4">
        <Header />
        <Toaster />
        <div className="shorts-container w-full bg-pink-50 h-screen overflow-x-hidden sm:mt-10 mt-5">
          <div className="w-11/12 lg:w-3/12 scroll-bar-css custom-height-shorts flex flex-col items-center m-auto">
            {Array.isArray(shorts?.data) && shorts?.data.length > 0
              ? shorts?.data.map((item, index) => (
                  <div
                    className="short w-full mb-10 cursor-pointer"
                    key={index}
                  >
                    <div
                      className="short-video w-full relative"
                      onMouseEnter={() =>
                        shortOptionsHandler(index, "mouseenter")
                      }
                      onMouseLeave={() =>
                        shortOptionsHandler(index, "mouseleave")
                      }
                    >
                      <video
                        ref={(e) => (videoRefs[index] = e)}
                        key={index}
                        src={item.shortURL}
                        muted={true}
                        loop={true}
                        autoPlay={true}
                        className="w-full h-full shorts-css"
                        onClick={() => shortClickHandler(index)}
                        onDoubleClick={() => {
                          bigHeartDblClickHandler(
                            index,
                            item,
                            item.shortLikes.includes(
                              loadedUser?.currentUser?._id
                            )
                          );
                        }}
                      ></video>
                      {
                        <div
                          ref={(e) => (optionsRefs[index] = e)}
                          className={`${optionIndex === index ? "" : "hidden"}`}
                        >
                          <img
                            src={VideoPauseBtn}
                            alt=""
                            className={`w-6 h-6 absolute top-10 left-10 invert cursor-pointer`}
                            onClick={() => shortController(index)}
                            ref={(e) => (playBtnRefs[index] = e)}
                          />
                          <img
                            src={MutedSpeaker}
                            ref={(e) => (speakerBtnRefs[index] = e)}
                            alt=""
                            className={` w-6 h-6 absolute top-10 right-10 invert cursor-pointer`}
                            onClick={() => speakerHandler(index, item)}
                          />
                        </div>
                      }
                      <div className="shorts-details h-24 absolute bottom-0 w-full">
                        <div className="channel-details flex items-center ml-5">
                          <img
                            src={item.shortUploadedBy?.userAvatar}
                            alt=""
                            className="w-7 h-7 lg:w-10 lg:h-10 rounded-full"
                          />
                          <div className="flex items-center">
                            <h1 className="channel-name text-white text-xs lg:text-lg  ml-2 line-clamp-name">
                              {item.shortUploadedBy?.userChannel.length > 15
                                ? item.shortUploadedBy?.userChannel.slice(
                                    0,
                                    16
                                  ) + "..."
                                : item.shortUploadedBy?.userChannel}
                            </h1>
                            {item.shortUploadedBy._id ===
                            loadedUser?.currentUser?._id ? (
                              ""
                            ) : (
                              <button
                                className={`${
                                  loadedUser?.currentUser?.subscriptions.includes(
                                    item.shortUploadedBy._id
                                  )
                                    ? "text-black bg-white"
                                    : "bg-black text-white"
                                } ml-4 rounded-3xl lg:px-2 lg:text-xs px-1 py-1`}
                                ref={(e) => (subsBtnRefs[index] = e)}
                                onClick={() => subscribeHandler(item)}
                              >
                                {loadedUser?.currentUser?.subscriptions.includes(
                                  item.shortUploadedBy._id
                                )
                                  ? "Subscribed"
                                  : "Subscribe"}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="short-description mx-5 lg:mr-20 mr-10 line-clamp-2 text-sm text-white">
                          {item.shortTitle}
                        </div>
                      </div>
                      <div className="shorts-options absolute right-2 bottom-4">
                        <div className="like w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center my-3">
                          <img
                            src={
                              item.shortLikes.includes(
                                loadedUser?.currentUser?._id
                              )
                                ? Liked
                                : Like
                            }
                            ref={(e) => (likesRefs[index] = e)}
                            alt=""
                            className="w-5 h-5 active:scale-50 transition-transform duration-300"
                            onClick={() => likeHandler(index, item)}
                            data-custom-like-value={
                              item.shortLikes.includes(
                                loadedUser?.currentUser?._id
                              )
                                ? "liked"
                                : "unliked"
                            }
                          />
                        </div>
                        <h1 className="like-count text-white text-center text-sm">
                          {item.shortLikes.length}
                        </h1>
                        <div className="dislike w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center my-3">
                          <img
                            src={
                              item.shortDislikes.includes(
                                loadedUser?.currentUser?._id
                              )
                                ? Disliked
                                : Dislike
                            }
                            ref={(e) => (dislikesRefs[index] = e)}
                            alt=""
                            className="w-5 h-5 active:scale-50 transition-transform duration-300"
                            onClick={() => dislikeHandler(index, item)}
                            data-custom-dislike-value={
                              item.shortDislikes.includes(
                                loadedUser?.currentUser?._id
                              )
                                ? "disliked"
                                : "undisliked"
                            }
                          />
                        </div>
                        <div className="download w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center my-3">
                          <img
                            src={Download}
                            ref={(e) => (downloadRefs[index] = e)}
                            alt=""
                            className="w-5 h-5 active:scale-50 transition-transform duration-300"
                          />
                        </div>
                        <div className="share w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center my-3">
                          <img
                            src={Share}
                            ref={(e) => (shareRefs[index] = e)}
                            alt=""
                            className="w-5 h-5 active:scale-50 transition-transform duration-300"
                          />
                        </div>
                        <div className="three-dots w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center my-3">
                          <img
                            src={ThreeDots}
                            alt=""
                            className="w-5 h-5 active:scale-50 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      <div className="middle-like absolute top-60 left-32 xl:top-80 xl:left-44">
                        <img
                          src={""}
                          ref={(e) => (bigHeartRefs[index] = e)}
                          alt=""
                          className=" w-20 h-20 invert transition duration-300 ease-in-out"
                        />
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shorts;
