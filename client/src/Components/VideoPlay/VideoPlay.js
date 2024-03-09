import React, { useEffect, useState, useRef } from "react";
import BottomBar from "../BottomBar/BottomBar";
import Header from "../Header/Header";
import "./VideoPlay.css";
import Badge from "../../Assets/black-tick.png";
import Like from "../../Assets/like.png";
import Liked from "../../Assets/liked.png";
import Dislike from "../../Assets/dislike.png";
import Disliked from "../../Assets/disliked.png";
import ThreeDots from "../../Assets/three-dots.png";
import Share from "../../Assets/share.png";
import Download from "../../Assets/download.png";
import DownArrow from "../../Assets/down-arrow.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import loginAction from "../Redux/Actions/Login/LoginAction";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import {
  handleShowSuccessToast,
  handleShowFailureToast,
} from "../../Components/ToastMessages/ToastMessage";
import LoaderCircles from "../Loader/LoaderCircles";
import videosLoaderAction from "../Redux/Actions/Home/VideosAction";
import { useNavigate } from "react-router-dom";
const VideoPlay = () => {
  const [isDescriptionOpened, setDescriptionOpener] = useState(false);
  const [isOptionShowing, setOptionShowing] = useState(false);
  const [isOptionSelected, setOptionSelection] = useState(2);
  const [isSendCommentOptionShowing, setSendCommentOptions] = useState(false);
  const [isComment, setComment] = useState("");
  const location = useLocation();
  const video = location.state && location.state.video;
  const [loadedComments, setLoadedComments] = useState([]);
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const [loadedVideo, setLoadedVideo] = useState({});
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const dispatch = useDispatch();
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();
  const likeRef = useRef();
  const dislikeRef = useRef();
  const [isLiked, setLiked] = useState(false);
  const [isDisliked, setDisliked] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const commentsSortingHandler = () => {
    if (!isOptionShowing) {
      setOptionShowing(true);
    } else {
      setOptionShowing(false);
    }
  };
  const optionsHandler = () => {
    setLoadedComments((loadedComments) => {
      let sortedComments = [...loadedComments];

      if (isOptionSelected === 1) {
        sortedComments.sort((a, b) => {
          return new Date(b.commentTime) - new Date(a.commentTime);
        });
        setOptionSelection(2);
      } else if (isOptionSelected === 2) {
        sortedComments.sort((a, b) => {
          return new Date(a.commentTime) - new Date(b.commentTime);
        });
        setOptionSelection(1);
      }

      setOptionShowing(false);
      return sortedComments;
    });
  };

  const sendCommentHandler = async () => {
    if (isComment) {
      try {
        await axios.post(`/api/v1/video/createcomment/${video?._id}`, {
          videoComment: isComment,
        });
        setSendCommentOptions(false);
        handleShowSuccessToast("Comment sent successfully");
        const response = await axios.get(
          `/api/v1/video/loadvideocomments/${video?._id}`
        );
        const sortedComments = response?.data?.videoComments.videoComments.sort(
          (a, b) => {
            return new Date(b.commentTime) - new Date(a.commentTime);
          }
        );
        setLoadedComments(sortedComments);
        setComment("");
      } catch (error) {
        setComment("");
        console.log(error.response.data.message);
        handleShowFailureToast(error.response.data.message);
      }
    }
  };
  const callingLoadVideoApi = async (id) => {
    try {
      if (id) {
        const response = await axios.get(
          `/api/v1/video/loadvideocomments/${id}`
        );
        const myvideo = response.data?.videoComments;
        setLoadedVideo({ video: myvideo });
        return;
      }
      const response = await axios.get(
        `/api/v1/video/loadvideocomments/${video?._id}`
      );
      const myvideo = response.data?.videoComments;
      setLoadedVideo({ video: myvideo });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const commentLoader = async () => {
    try {
      setCommentLoading(true);
      const response = await axios.get(
        `/api/v1/video/loadvideocomments/${video?._id}`
      );
      const sortedComments = response?.data?.videoComments.videoComments.sort(
        (a, b) => {
          return new Date(b.commentTime) - new Date(a.commentTime);
        }
      );
      setLoadedComments(sortedComments);
    } catch (error) {
      console.log(error?.response.data.message);
    } finally {
      setCommentLoading(false);
    }
  };
  useEffect(() => {
    commentLoader();
    if (user) {
      dispatch(loginAction(user));
    }
    dispatch(loadUserAction());
  }, []);

  function videosLoaderApi() {
    dispatch(videosLoaderAction());
  }
  const { loadedUser, authenticated, loading } = useSelector(
    (state) => state.loadedUser
  );
  useEffect(() => {
    if (user) {
      dispatch(loginAction(user));
    }
    videosLoaderApi();
  }, []);
  const inputOptionHandler = () => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
      return;
    }
    if (!isSendCommentOptionShowing) {
      setSendCommentOptions(true);
    }
  };
  const likeHandler = async (video) => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
      return;
    }
    if (
      loadedVideo?.video?.videoLikes?.includes(loadedUser?.currentUser?._id)
    ) {
      await axios.get(`/api/v1/video/likevideo/${video?._id}`);
      handleShowSuccessToast("You unliked the video");
      setLiked(false);
      callingLoadVideoApi(loadedVideo?._id);
      return;
    } else if (
      !loadedVideo?.video?.videoLikes?.includes(loadedUser?.currentUser?._id)
    ) {
      try {
        await axios.get(`/api/v1/video/likevideo/${video?._id}`);
        handleShowSuccessToast("You liked the video");
        setLiked(true);
        callingLoadVideoApi(loadedVideo?._id);
      } catch (error) {
        console.error("Error in unlike request:", error);
      }
    }
  };

  const dislikeHandler = async (video) => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
      return;
    }
    if (video?.videoDislikes?.includes(loadedUser?.currentUser?._id)) {
      try {
        await axios.get(`/api/v1/video/dislikevideo/${video?._id}`);
        handleShowSuccessToast("You undislike the video");
        setDisliked(false);
        callingLoadVideoApi(video?._id);
      } catch (error) {
        console.error("Error in dislike request:", error);
      }
      return;
    } else if (!video?.videoDislikes?.includes(loadedUser?.currentUser?._id)) {
      try {
        await axios.get(`/api/v1/video/dislikevideo/${video?._id}`);
        handleShowSuccessToast("You disliked the video");
        setDisliked(true);
        callingLoadVideoApi(video?._id);
      } catch (error) {
        console.error("Error in dislike or unlike request:", error);
      }
      return;
    }
  };
  const descriptionHandler = () => {
    if (!isDescriptionOpened) {
      setDescriptionOpener(true);
    } else {
      setDescriptionOpener(false);
    }
  };

  const subscribeHandler = async (video) => {
    if (
      !loadedVideo?.video?.videoUploadedBy?.subscribers?.includes(
        loadedUser?.currentUser?._id
      )
    ) {
      try {
        const response = await axios.get(
          `/api/v1/user/subscribe/${loadedUser?.currentUser?._id}/${loadedVideo?.video?.videoUploadedBy?._id}`
        );
        callingLoadVideoApi();
        dispatch(loadUserAction());
        handleShowSuccessToast(response.data.message);
      } catch (error) {
        console.log("Subscribe error of " + error.response.data.message);
      }
    } else if (
      loadedVideo?.video?.videoUploadedBy?.subscribers?.includes(
        loadedUser?.currentUser?._id
      )
    ) {
      try {
        const response = await axios.get(
          `/api/v1/user/subscribe/${loadedUser.currentUser._id}/${loadedVideo?.video?.videoUploadedBy._id}`
        );
        callingLoadVideoApi();
        dispatch(loadUserAction());
        handleShowSuccessToast(response.data.message);
      } catch (error) {
        console.log("Subscribe error of " + error.response.data.message);
      }
    }
  };

  function formatInstagramTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / (60 * 60 * 24 * 365));
    if (interval > 1) {
      return `${interval} years ago`;
    } else if (interval === 1) {
      return `${interval} year ago`;
    }
    interval = Math.floor(seconds / (60 * 60 * 24 * 30));
    if (interval > 1) {
      return `${interval} months ago`;
    } else if (interval === 1) {
      return `${interval} month ago`;
    }
    interval = Math.floor(seconds / (60 * 60 * 24 * 7));
    if (interval > 1) {
      return `${interval} weeks ago`;
    } else if (interval === 1) {
      return `${interval} week ago`;
    }
    interval = Math.floor(seconds / (60 * 60 * 24));
    if (interval > 1) {
      return `${interval} days ago`;
    } else if (interval === 1) {
      return `${interval} day ago`;
    }

    interval = Math.floor(seconds / (60 * 60));
    if (interval >= 1) {
      return `${interval} h ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} min ago`;
    }

    return `${Math.floor(seconds)} s ago`;
  }

  let { videoLoading, videos } = useSelector((state) => state.videos);
  const playVideo = async (video1) => {
    try {
      await axios.get(`/api/v1/video/videoviews/${video1?._id}`);
      console.log("Video views updated successfully");
      navigate("/playvideo", { state: { video: video1 } });
      callingLoadVideoApi(video1._id);
      commentLoader();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const tempVideos = videos?.videos?.filter((item) => {
    return video?._id !== item?._id;
  });
  useEffect(() => {
    if (
      loadedVideo?.video?.videoLikes?.includes(loadedUser?.currentUser?._id)
    ) {
      setLiked(true);
    } else if (
      !loadedVideo?.video?.videoLikes?.includes(loadedUser?.currentUser?._id)
    ) {
      setLiked(false);
    }
    if (
      loadedVideo?.video?.videoDislikes?.includes(loadedUser?.currentUser?._id)
    ) {
      setDisliked(true);
    } else if (
      !loadedVideo?.video?.videoDislikes?.includes(loadedUser?.currentUser?._id)
    ) {
      setDisliked(false);
    }
  }, [loadedUser, loadedVideo, isLiked, isDisliked]);

  useEffect(() => {
    if (!isVideo) {
      callingLoadVideoApi();
      setIsVideo(true);
    }
  }, [isVideo]);
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4 sm:px-6">
        <div>
          <Header />
        </div>
        <Toaster />
        <div className="video-play-container bg-pink-50 flex flex-wrap w-full justify-between md:mt-10 mt-5">
          <div className="left-part xl:w-5/6 w-full">
            <div className="video w-full">
              <video
                className=" rounded w-full"
                id="myvideo"
                src={video && video?.videoURL}
                autoPlay={true}
                loop={true}
                controls="true"
              ></video>
            </div>
            <div className="video-title">
              <h1 className=" md:text-1xl text-xl xl:text-2xl font-semibold mt-3">
                {video?.videoTitle}
              </h1>
            </div>
            <div className="video-options flex flex-wrap justify-between items-center">
              <div className="left-options flex md:w-1/3 w-full">
                <div className="channel-details flex w-full h-full mt-2">
                  <div className="profile-div flex justify-center items-center">
                    <img
                      src={video && video?.videoUploadedBy.userAvatar}
                      alt=""
                      className="md-h-10
                      md-w-10
                      w-9
                      h-9 rounded-full"
                    />
                  </div>
                  <div className="channel-name-subscribers flex flex-col justify-center ml-2">
                    <div className="name flex items-center">
                      <h1 className="font-semibold text-sm">
                        {video && video?.videoUploadedBy.userChannel}
                      </h1>
                      <img src={Badge} alt="" className="w-5 h-5 ml-1" />
                    </div>
                    <h1 className=" text-xs">
                      {loadedVideo &&
                        loadedVideo?.video?.videoUploadedBy?.subscribers
                          .length}{" "}
                      subscribers
                    </h1>
                  </div>
                  {loadedUser?.currentUser?._id ===
                  video?.videoUploadedBy?._id ? (
                    ""
                  ) : (
                    <div>
                      {loadedVideo?.video?.videoUploadedBy?.subscribers?.includes(
                        loadedUser?.currentUser?._id
                      ) ? (
                        <div
                          className={`channel-subscribe-button flex items-center h-full transition-opacity duration-700 ease-in-out`}
                        >
                          <button
                            className=" bg-slate-200 text-black md:px-6 md:py-1.5 px-4 py-0.5 rounded-3xl ml-8 md:mt-2 mt-1"
                            onClick={() => subscribeHandler(video)}
                          >
                            Subscribed
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`channel-subscribe-button flex items-center h-full`}
                        >
                          <button
                            className=" bg-black text-white md:px-6 md:py-1.5 px-4 py-0.5 rounded-3xl ml-8 md:mt-2 mt-1"
                            onClick={() => subscribeHandler(video)}
                          >
                            Subscribe
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="right-options md:w-2/3 w-full flex items-center md:justify-end justify-between sm:justify-start">
                <div className="likes flex items-center justify-around bg-slate-200 md:w-40 md:h-9 w-32 h-7 rounded-3xl mt-3 px-2">
                  <div className="like cursor-pointer flex justify-center items-center">
                    <img
                      src={isLiked ? Liked : Like}
                      ref={likeRef}
                      alt=""
                      className="md:w-6 md:h-6 w-5 h-5 active:scale-50 transition-transform duration-300"
                      onClick={() => likeHandler(video)}
                    />
                    <p className=" ml-2">
                      {loadedVideo?.video?.videoLikes?.length}
                    </p>
                  </div>
                  <div className="like-line md:h-6 h-5 bg-slate-400"></div>
                  <div className="dislike cursor-pointer">
                    <img
                      src={isDisliked ? Disliked : Dislike}
                      ref={dislikeRef}
                      alt=""
                      className="md:w-6 md:h-6 w-5 h-5 active:scale-50 transition-transform duration-300"
                      onClick={() => dislikeHandler(video)}
                    />
                  </div>
                </div>
                <div className="shares flex items-center justify-evenly bg-slate-200 md:w-28 md:h-9 w-20 h-7 rounded-3xl mt-3 px-1 ml-2 cursor-pointer">
                  <img src={Share} alt="" className="md:w-5 md:h-5 w-3 h-3" />
                  <h1>Share</h1>
                </div>
                <div className="download flex items-center justify-evenly bg-slate-200 md:w-36 md:h-9 w-28 h-7 rounded-3xl mt-3 px-1 ml-2 cursor-pointer">
                  <img
                    src={Download}
                    alt=""
                    className="md:w-5 md:h-5 w-4 h-4"
                  />
                  <h1>Download</h1>
                </div>
                <div className="three-dots flex items-center justify-evenly bg-slate-200 md:w-9 md:h-9 w-7 h-7 rounded-full mt-3 px-1 ml-2 cursor-pointer">
                  <img
                    src={ThreeDots}
                    alt=""
                    className="md:w-4 md:h-4 w-3 h-3"
                  />
                </div>
              </div>
              {/* video description */}
              <div
                className={`discription w-full bg-slate-200 ${
                  isDescriptionOpened ? "h-full" : "h-30"
                } mt-5 rounded-lg`}
                id="video-description"
              >
                <div className="description-text px-5 py-2 flex justify-between">
                  <div className="flex mt-8">
                    <p className=" text-base text-slate-800">
                      {loadedVideo && loadedVideo?.video?.videoViews} views
                    </p>
                    <div className="flex justify-center items-center">
                      <div className="dot w-1 h-1 bg-slate-700 rounded-full mx-2"></div>
                    </div>
                    <p className=" text-base text-slate-800">
                      {loadedVideo &&
                        formatInstagramTime(
                          new Date(loadedVideo?.video?.createdAt).getTime()
                        )}
                    </p>
                  </div>
                  <img
                    src={DownArrow}
                    alt=""
                    className={`w-8 h-8 cursor-pointer hover:bg-slate-300 hover:rounded-full p-2 ${
                      isDescriptionOpened ? "rotate-180" : ""
                    }`}
                    onClick={descriptionHandler}
                  />
                </div>
                <div className="description-text">
                  <h1
                    className={`${
                      isDescriptionOpened ? "" : "description-text-tag"
                    } text-ellipsis overflow-hidden px-4 mb-4`}
                  >
                    {video?.videoDescription}
                  </h1>
                </div>
              </div>
              {/* comments-section  */}
              <div className="comments-container mt-2 ml-1 w-full">
                <div className="comments-size-sorts flex">
                  <div className="comments-size">
                    <h1 className=" font-extrabold">
                      {loadedComments.length + " comments"}
                    </h1>
                  </div>
                  <div className="comment-sorting flex items-center ml-3 relative">
                    <img
                      src={DownArrow}
                      alt=""
                      className={`w-5 h-5 cursor-pointer ${
                        isOptionShowing ? "rotate-180" : ""
                      }`}
                      onClick={commentsSortingHandler}
                    />
                    <h1 className=" font-bold ml-2">Sort By</h1>
                    <div
                      className={`${
                        isOptionShowing ? "absolute" : "hidden"
                      } top-8 left-0 right-3 sorting-options w-28 h-32 bg-slate-300 rounded-lg flex flex-col items-center justify-evenly`}
                    >
                      <h1
                        className={`${
                          isOptionSelected === 1 ? "bg-white" : "hover:bg-white"
                        } w-full text-center py-2 cursor-pointer`}
                        onClick={optionsHandler}
                      >
                        Default
                      </h1>
                      <h1
                        className={`${
                          isOptionSelected === 2 ? "bg-white" : "hover:bg-white"
                        } w-full text-center py-2 cursor-pointer`}
                        onClick={optionsHandler}
                      >
                        Newest
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="add-comment w-full">
                  <div className="profile-comment-input flex w-full items-center my-4">
                    <div className="w-1/6 sm:w-10">
                      <img
                        src={loadedUser?.currentUser.userAvatar}
                        alt=""
                        className="md-h-10
                      md-w-10
                      w-9
                      h-9
                      rounded-full"
                      />
                    </div>
                    <div className="w-5/6 sm:w-full">
                      <div className="w-full pr-4">
                        <input
                          type="text"
                          placeholder="Add your comment"
                          className="w-full bg-transparent border-b-2 border-solid border-slate-300 focus:outline-none sm:mx-3"
                          id="comment-input"
                          value={isComment}
                          onClick={inputOptionHandler}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      isSendCommentOptionShowing ? "flex" : "hidden"
                    } add-comment-options w-full items-center justify-end`}
                  >
                    <button
                      className="mr-4 bg-slate-200 hover:bg-slate-300 px-8 py-2 rounded-3xl"
                      onClick={() => setSendCommentOptions(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${
                        isComment === "" ? "hidden" : "block"
                      } bg-blue-600 text-white px-8 py-2 rounded-3xl`}
                      onClick={sendCommentHandler}
                    >
                      Comment
                    </button>
                    <button
                      className={`${
                        isComment === "" ? "block" : "hidden"
                      } bg-slate-200 text-white px-8 py-2 rounded-3xl`}
                      disabled
                    >
                      Comment
                    </button>
                  </div>
                </div>
                {commentLoading ? (
                  <div className=" w-full h-40 flex justify-center items-center">
                    <LoaderCircles />
                  </div>
                ) : (
                  <div className="comments w-full">
                    {/* comment 1 */}
                    {loadedComments &&
                    Array.isArray(loadedComments) &&
                    loadedComments.length > 0 ? (
                      loadedComments.map((comment) => (
                        <div className="comment w-full">
                          <div className="flex items-center">
                            <img
                              src={comment.commentedBy?.userAvatar}
                              alt=""
                              className="md-h-10
                      md-w-10
                      w-9
                      h-9
                      rounded-full"
                            />
                            <h1 className="ml-2 font-semibold">
                              {comment.commentedBy?.userChannel}
                            </h1>
                            <div className="dot w-1 h-1 bg-slate-700 rounded-full mx-2"></div>
                            <p className="text-sm">
                              {formatInstagramTime(
                                new Date(comment.commentTime).getTime()
                              )}
                            </p>
                          </div>
                          <div className="flex ml-2 mt-0 mb-4">
                            <div className="w-9"></div>
                            <p>{comment.videoComment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div>
                        <h1 className=" text-slate-600 text2xl">No comments</h1>
                      </div>
                    )}
                  </div>
                )}
                <div className="lg:mb-0 mb-8"></div>
              </div>
            </div>
          </div>
          <div className="right-part xl:w-1/6 xl:block hidden">
            <div className="videos-section w-full border border-solid border-slate-200 bottom-1 mx-2 shadow shadow-slate-300 rounded">
              <h1 className=" text-xl font-bold mx-3 mb-3 mt-1">
                Suggested Videos
              </h1>
              {/* suggested videos*/}

              {videoLoading ? (
                <div className="flex justify-center mt-10 ">
                  <LoaderCircles />
                </div>
              ) : (
                <div className="suggested-video-container">
                  {tempVideos &&
                  Array.isArray(tempVideos) &&
                  tempVideos.length > 0 ? (
                    tempVideos.map((item) => (
                      <div
                        className="video w-full flex px-2 items-center cursor-pointer mb-4 hover:scale-105 transition-transform duration-700 ease-in-out"
                        onClick={() => playVideo(item)}
                      >
                        <div className="thumbnail w-2/6 relative">
                          <div className="relative">
                            <video
                              src={item.videoURL}
                              className="rounded w-full object-cover cursor-pointer"
                            ></video>
                            {item.videoThumbnail ? (
                              <img
                                src={item.videoThumbnail}
                                className="w-full h-13 absolute top-0 rounded hover:cursor-pointer hover:bg-opacity-95 object-cover overflow-hidden"
                                alt=""
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <p className="absolute bottom-0 text-white right-1 text-xs">
                            {item?.videoDuration % 60 > 10
                              ? Math.floor(item?.videoDuration / 60) +
                                ":" +
                                Math.floor(item?.videoDuration % 60)
                              : Math.floor(item?.videoDuration / 60) +
                                ":0" +
                                Math.floor(item?.videoDuration % 60)}
                          </p>
                        </div>
                        <div className="video-information w-3/6 mx-1">
                          <h1 className="video-suggestion-text text-sm">
                            {item?.videoTitle}
                          </h1>
                          <p className="description-text-tag font-extralight text-xs">
                            {item?.videoUploadedBy?.userChannel}
                          </p>
                        </div>
                        <div className="video-information w-1/6">
                          <img
                            src={item?.videoUploadedBy?.userAvatar}
                            alt=""
                            className="md-h-10
                      md-w-10
                      w-9
                      h-9
                      rounded-full"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <h1 className="text-center mt-3">No videos</h1>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoPlay;
