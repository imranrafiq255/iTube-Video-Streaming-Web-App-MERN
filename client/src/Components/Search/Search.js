import React, { useEffect, useState } from "react";
import BottomBar from "../../Components/BottomBar/BottomBar";
import Header from "../Header/Header";
import { useSearch } from "../../Components/ContextApi/SearchContext";
import Badge from "../../Assets/black-tick.png";
import { useDispatch, useSelector } from "react-redux";
import videosLoaderAction from "../Redux/Actions/Home/VideosAction.js";
import "./Search.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  const { searchData, setSearchData } = useSearch();
  const dispatch = useDispatch();
  const [searchedVideos, setSearchVideos] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(videosLoaderAction());
  }, []);
  const { videos } = useSelector((state) => state.videos);
  useEffect(() => {
    if (searchData && videos?.videos) {
      const filteredVideos = videos?.videos?.filter((item) => {
        return item.videoTitle
          .toLowerCase()
          .startsWith(searchData.toLowerCase());
      });
      setSearchVideos(filteredVideos);
    }
    if (!searchData) {
      setSearchVideos([]);
    }
  }, [searchData, videos]);

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

  const searchedVideoClickHandler = (video) => {
    navigate("/playvideo", { state: { video } });
    setSearchData("");
  };
  return (
    <>
      <BottomBar />
      <div className="search-container bg-pink-50 w-screen px-4 sm:px-6">
        <Header />
        <div className="w-full h-screen bg-white mt-5 rounded ">
          <div className="search-bar p-2">
            <input
              type="text"
              className=" block md:hidden w-full p-2.5 focus:outline-none border border-solid border-slate-400 rounded-full px-6 bg-transparent"
              placeholder="Search your video"
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <div className="item-container flex flex-col items-center">
            {searchedVideos && searchedVideos.length > 0 ? (
              searchedVideos.map((video) => (
                <div
                  className="search-item w-full lg:w-8/12 flex flex-wrap lg:flex-nowrap justify-center mb-5 cursor-pointer"
                  onClick={() => searchedVideoClickHandler(video)}
                >
                  <div className="video w-full lg:w-6/12 relative px-2">
                    <video
                      src={video?.videoURL}
                      className="rounded w-full"
                    ></video>
                    <p className="video-time absolute bottom-2 text-white right-4">
                      {video?.videoDuration % 60 > 10
                        ? Math.floor(video?.videoDuration / 60) +
                          ":" +
                          Math.floor(video?.videoDuration % 60)
                        : Math.floor(video?.videoDuration / 60) +
                          ":0" +
                          Math.floor(video?.videoDuration % 60)}
                    </p>
                  </div>
                  <div className="video-right-side ml-3 w-11/12 lg:w-6/12">
                    <div className="title">
                      <h1 className="text-2xl font-bold">{video.videoTitle}</h1>
                    </div>
                    <div className="views-time flex items-center gap-2 mt-2">
                      <h1>{video.videoViews} views</h1>
                      <div className="h-1 w-1 bg-slate-600 rounded-full"></div>
                      <h1>
                        {formatInstagramTime(
                          new Date(video?.createdAt).getTime()
                        )}
                      </h1>
                    </div>
                    <div className="Channel-info flex items-center gap-1 mt-2">
                      <img
                        src={video.videoUploadedBy.userAvatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <h1 className=" font-semibold">
                        {video.videoUploadedBy.userChannel}
                      </h1>
                      <img src={Badge} alt="" className="w-5 h-5" />
                    </div>
                    <div className="description mt-2">
                      <p className="w-full line-clamp-6">
                        {video.videoDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : searchData ? (
              <div>
                {" "}
                <h1 className="text-center">No video found</h1>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
