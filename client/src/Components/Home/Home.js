import React, { useEffect } from "react";
import "./Home.css";
import DownArrow from "../../Assets/down-arrow.png";
import ProfileImage from "../../Assets/user.png";
import DiscoverVideo from "../../Assets/discover-video.mp4";
import VideoLogo from "../../Assets/video-logo.png";
import ShortLogo from "../../Assets/shorts-logo.png";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import videosLoaderAction from "../Redux/Actions/Home/VideosAction.js";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction.js";
import LoaderCircles from "../Loader/LoaderCircles.js";
import axios from "axios";
import shortsLoaderAction from "../Redux/Actions/Home/ShortsAction.js";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(videosLoaderAction());
    dispatch(loadUserAction());
  }, []);
  let { videoLoading, videos } = useSelector((state) => state.videos);
  useEffect(() => {
    dispatch(shortsLoaderAction());
  }, []);
  const { shorts, shortLoading } = useSelector((state) => state.shorts);
  let sortedVideos =
    Array.isArray(videos?.videos) &&
    videos.videos?.slice().sort((a, b) => {
      return b.videoViews - a.videoViews;
    });

  videos = sortedVideos;

  const channelNameClickHandler = (id) => {
    navigate(`/account/user/${id}`);
  };
  const playVideo = async (video) => {
    try {
      await axios.get(
        `https://i-tube-video-streaming-web-app-mern.vercel.app/api/v1/video/videoviews/${video._id}`
      );
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      navigate("/playvideo", { state: { video } });
    }
  };
  const shortsClickHanlder = () => {
    navigate("/shorts");
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
  return (
    <>
      {/* <Upload /> */}
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4 sm:px-6">
        <Header />
        <div className="discover-text mt-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold">
            Discover
          </h1>
        </div>
        <div className="discover-video w-full relative pt-10">
          <div className=""></div>
          <video
            className="w-full object-cover rounded carousel-video-media"
            autoPlay
            controls={false}
            muted
            loop
            playsInline
          >
            <source src={DiscoverVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="quote-overlay absolute inset-0 flex justify-center items-center text-white text-center">
            <h1 className=" font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-slate-800">
                Discover
              </span>{" "}
              <br />
              the world with new ideas on <br />
              iTUBE
            </h1>
          </div>
        </div>
        <div className="popular-videos-text py-10 flex items-center justify-between">
          <img src={VideoLogo} alt="" className="w-10 h-10" />
          <div className=" bg-slate-600 inline py-2 px-6 text-white rounded ml-2 lg:ml-0">
            Popular videos
          </div>
          <div
            className="w-4/12 sm:w-1/2 md:w-2/3 lg:w-9/12 xl:w-9/12 ml-2 2xl:w-10/12 xl:ml-0 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
        </div>
        {/* videos section  */}
        {videoLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoaderCircles />
          </div>
        ) : (
          <div className="videos-container w-full flex flex-wrap">
            {/* video 1 */}
            {videos && Array.isArray(videos) && videos.length > 0 ? (
              videos.map((video) => (
                <div className="video w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 relative p-2">
                  <div
                    className="video-thumbnail bg-transparent overflow-hidden object-cover relative"
                    onClick={() => playVideo(video)}
                  >
                    <video
                      src={videos && video.videoURL}
                      className="rounded h-48 w-full object-cover cursor-pointer"
                    ></video>
                    {videos && video.videoThumbnail ? (
                      <img
                        src={video.videoThumbnail}
                        className="w-full h-full absolute top-0 rounded hover:cursor-pointer hover:bg-opacity-95 object-cover overflow-hidden"
                        alt=""
                      />
                    ) : (
                      ""
                    )}

                    <p className="absolute text-white bottom-2 right-5">
                      {video?.videoDuration % 60 > 10
                        ? Math.floor(video?.videoDuration / 60) +
                          ":" +
                          Math.floor(video?.videoDuration % 60)
                        : Math.floor(video?.videoDuration / 60) +
                          ":0" +
                          Math.floor(video?.videoDuration % 60)}
                    </p>
                  </div>
                  <div className="video-information flex items-center w-full cursor-pointer">
                    <div className="creater-profile rounded-full bg-black my-2">
                      <div className=" h-10 w-10">
                        <img
                          src={
                            videos && video.videoUploadedBy.userAvatar
                              ? video.videoUploadedBy.userAvatar
                              : ProfileImage
                          }
                          alt=""
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          onClick={() =>
                            channelNameClickHandler(video.videoUploadedBy._id)
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="video-details"
                      onClick={() => playVideo(video)}
                    >
                      <div className="video-title w-full">
                        <h1 className="ml-6 line-clamp-2 font-semibold">
                          {videos && video.videoTitle
                            ? video.videoTitle
                            : "video title"}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="video-bottom-details pl-16">
                    <div className="channel-name">
                      <h3
                        className="text-slate-700 cursor-pointer"
                        onClick={() =>
                          channelNameClickHandler(video.videoUploadedBy._id)
                        }
                      >
                        {videos && video.videoUploadedBy.userChannel
                          ? video.videoUploadedBy.userChannel
                          : "channel"}
                      </h3>
                    </div>
                    <div className="video-time-and-views flex items-center">
                      <div className="views">
                        <h3 className="text-slate-700">
                          {video?.videoViews + " views"}
                        </h3>
                      </div>
                      <div className="dot w-1 h-1 bg-black rounded-full mx-2"></div>
                      <div className="views">
                        <h3 className=" text-slate-700">
                          {formatInstagramTime(
                            new Date(video?.createdAt).getTime()
                          )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                <h1 className=" text-2xl text-slate-700">
                  No video in database
                </h1>
              </div>
            )}
          </div>
        )}

        <div className="see-more flex items-center justify-center h-40 mt-12 pb-24 lg:pb-12">
          <div
            className="left-line w-3/12 sm:w-1/5 md:w-2/5 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
          <div className="see w-5/12 flex md:w-1/5 cursor-pointer">
            <div
              className="border border-solid border-slate-500 w-full py-1.5 font-semibold hover:bg-slate-200 flex justify-center items-center cursor-pointer"
              style={{ borderRadius: "20px" }}
            >
              <p>Show more</p>
              <img src={DownArrow} className="w-5 h-5 ml-2" alt="" />
            </div>
          </div>
          <div
            className="right-line w-3/12 sm:w-1/5 md:w-2/5 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
        </div>
        <div className="popular-videos-text py-10 flex items-center justify-between">
          <img src={ShortLogo} alt="" className="w-10 h-10 invert" />
          <div className=" bg-slate-600 inline py-2 px-6 text-white rounded">
            Popular shorts
          </div>
          <div
            className="w-4/12 sm:w-1/2 md:w-2/3 lg:w-9/12 xl:w-9/12 2xl:w-10/12 ml-2 xl:ml-0 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
        </div>
        {/* shorts section  */}
        {/* short 1 */}
        {shortLoading ? (
          <div className="w-full flex justify-center mt-10">
            <LoaderCircles />
          </div>
        ) : (
          <div className="shorts-container w-full flex flex-wrap">
            {shorts && Array.isArray(shorts.data) && shorts.data.length > 0 ? (
              shorts.data.map((short) => (
                <div className="short w-full sm:w-1/2 md:w-1/3 lg:w-1/5 2xl:w-1/6 relative p-2 pt-8">
                  <video
                    src={short.shortURL}
                    className="w-full rounded cursor-pointer"
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    onClick={shortsClickHanlder}
                  ></video>
                  <div className="short-title w-full cursor-pointer">
                    <h1 className="mt-3 line-clamp-2 font-semibold">
                      {short.shortTitle}
                    </h1>
                  </div>
                  <div className="short-views mt-3">
                    <h3 className="text-slate-700">{short.shortViews} views</h3>
                  </div>
                </div>
              ))
            ) : (
              <h1 className=" text-2xl text-slate-700">No short in database</h1>
            )}
          </div>
        )}
        <div className="see-more flex items-center justify-center h-40 mt-12 pb-24 lg:pb-12">
          <div
            className="left-line w-3/12 sm:w-1/5 md:w-2/5 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
          <div className="see w-5/12 flex md:w-1/5 cursor-pointer">
            <div
              className="border border-solid border-slate-500 w-full py-1.5 font-semibold hover:bg-slate-200 flex justify-center items-center cursor-pointer"
              style={{ borderRadius: "20px" }}
            >
              <p>Show more</p>
              <img src={DownArrow} className="w-5 h-5 ml-2" alt="" />
            </div>
          </div>
          <div
            className="right-line w-3/12 sm:w-1/5 md:w-2/5 bg-slate-500"
            style={{ height: "0.1px" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Home;
