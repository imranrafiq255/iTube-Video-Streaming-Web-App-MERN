import React, { useState, useEffect, useMemo } from "react";
import "./Upload.css";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import ThumbnailSelectorIcon from "../../Assets/thumbnail-selector.png";
import VideoIcon from "../../Assets/video-upload-icon.png";
import { useDispatch, useSelector } from "react-redux";
import loginAction from "../Redux/Actions/Login/LoginAction";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction";
import { useAuth0 } from "@auth0/auth0-react";
import LoaderCircles from "../Loader/LoaderCircles";
import axios from "axios";
import ProgressBar from "@ramonak/react-progress-bar";
import { Toaster } from "react-hot-toast";
import {
  handleShowSuccessToast,
  handleShowFailureToast,
} from "../../Components/ToastMessages/ToastMessage.js";
import RingLoader from "../Loader/RingLoader.js";
import { useNavigate } from "react-router-dom";
const Upload = () => {
  const [progress, setProgress] = useState(0);
  const [videoPage, setVideoPage] = useState(true);
  const [shortPage, setShortPage] = useState(false);
  const [video, setvideo] = useState(null);
  const [videoSelectionErrorMessage, setVideoSelectionErrorMessage] =
    useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [title, setTitle] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState(title);
  const [description, setDescription] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] =
    useState(description);
  const [isUploading, setUploading] = useState(false);
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const videoPageSlider = () => {
    if (shortPage === true) {
      setVideoPage(true);
      setShortPage(false);
    }
  };

  const shortPageSlider = () => {
    if (videoPage === true) {
      setShortPage(true);
      setVideoPage(false);
    }
  };

  const videosSelectionHandler = () => {
    document.getElementById("video-select-id").click();
  };

  const thumbnailSelector = () => {
    document.getElementById("thumbnail-input-id").click();
  };

  const acceptedImageTypes = useMemo(
    () => ["image/png", "image/jpeg", "image/jpg"],
    []
  );

  useEffect(() => {
    if (video) {
      if (video.type !== "video/mp4") {
        setVideoSelectionErrorMessage("Invalid format (" + video.type + ")");
      } else {
        setVideoSelectionErrorMessage("");
      }
    }
  }, [video]);

  useEffect(() => {
    if (thumbnail) {
      if (!acceptedImageTypes.includes(thumbnail.type)) {
        setInputErrorMessage(`Invalid thumbnail format (${thumbnail.type})`);
      } else {
        setInputErrorMessage("");
      }
    }
  }, [thumbnail, acceptedImageTypes]);

  useEffect(() => {
    if (title === "") {
      setTitleErrorMessage("please enter video title *");
    } else {
      setTitleErrorMessage("");
    }
  }, [title]);

  useEffect(() => {
    if (description === "") {
      setDescriptionErrorMessage("please enter video description *");
    } else {
      setDescriptionErrorMessage("");
    }
  }, [description]);

  useEffect(() => {
    if (user) {
      dispatch(loginAction(user));
    }
    dispatch(loadUserAction());
  }, [dispatch, user]);

  const { authenticated, loading } = useSelector((state) => state.loadedUser);

  useEffect(() => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
    }
  });

  const formHandler = (e) => {
    e.preventDefault();
    if (title === "") {
      setTitleErrorMessage("please enter video title *");
    }
    if (description === "") {
      setDescriptionErrorMessage("please enter video description *");
    }
    if (title === "" || description === "") {
      return;
    }

    const formData = new FormData();
    formData.append("videoTitle", title);
    formData.append("videoDescription", description);
    if (videoPage) {
      formData.append("media", thumbnail);
      formData.append("media", video);
    } else {
      formData.append("file", video);
    }
    const totalVideoSize = video.size;

    const videoUploadApi = async () => {
      try {
        setUploading(true);
        if (videoPage) {
          await axios.post("/api/v1/video/uploadvideo", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded / totalVideoSize) * 100
              );
              setProgress(percentCompleted);
            },
          });
          handleShowSuccessToast("Video uploaded successfully");
          setUploading(false);
          navigate("/");
        } else {
          await axios.post("/api/v1/short/uploadshort", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded / totalVideoSize) * 100
              );
              setProgress(percentCompleted);
            },
          });
          handleShowSuccessToast("Video uploaded successfully");
          setUploading(false);
          navigate("/shorts");
        }
      } catch (error) {
        console.log(error.response.data.message);
        handleShowFailureToast(error.response.data.message);
        setUploading(false);
        setProgress(0);
      } finally {
        setProgress(0);
      }
    };

    videoUploadApi();
  };
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-screen px-4">
        <Header />
        <Toaster />
        {isLoading || loading ? (
          <div className="w-full h-screen flex justify-center items-center">
            <LoaderCircles />
          </div>
        ) : (
          <div className="upload-container bg-pink-50 mt-7 w-full h-auto flex justify-center">
            <div className=" w-full xl:w-1/2 custom-height bg-white rounded-lg p-4">
              {video && video.type === "video/mp4" ? (
                <div className="w-full h-full">
                  <h1 className="text-slate-600 text-xl font-bold text-center m-4">
                    {videoPage ? "Video" : "Short"}
                  </h1>
                  {/* form  */}
                  <div className="w-full h-4/5 flex flex-col justify-center">
                    <div className="form">
                      <div className="w-full xl:w-3/5 h-44 relative m-auto">
                        <video
                          src={
                            video &&
                            video.type === "video/mp4" &&
                            URL.createObjectURL(video)
                          }
                          className=" w-full h-full mt-5 m-auto rounded-lg object-cover"
                          controls={true}
                          muted={true}
                          autoPlay={true}
                        ></video>
                        <input
                          type="file"
                          className="hidden"
                          id="thumbnail-input-id"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                        />
                        {thumbnail &&
                          acceptedImageTypes.includes(thumbnail.type) && (
                            <img
                              src={URL.createObjectURL(thumbnail)}
                              alt=""
                              className="w-full h-full absolute top-0 rounded-lg"
                            />
                          )}
                      </div>
                      {inputErrorMessage && (
                        <h1 className="text-sm text-red-500 text-center">
                          {inputErrorMessage}
                        </h1>
                      )}
                      {(thumbnail && thumbnail.type === "image/png") ||
                      (thumbnail && thumbnail.type === "image/jpeg") ||
                      (thumbnail && thumbnail.type === "image/jpg") ? (
                        ""
                      ) : videoPage ? (
                        <div className="flex items-center justify-center gap-2 w-full xl:w-3/5 h-14 border-solid border-2 border-slate-300 rounded-lg px-2 m-auto mt-2">
                          <h1>Select thumbnail</h1>
                          <img
                            src={ThumbnailSelectorIcon}
                            alt=""
                            className="w-10 h-10 cursor-pointer"
                            onClick={thumbnailSelector}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {titleErrorMessage && (
                        <h1 className="text-sm text-center text-red-500">
                          {titleErrorMessage}
                        </h1>
                      )}
                      <div className="flex justify-center">
                        <input
                          type="text"
                          className={`${
                            titleErrorMessage
                              ? "border-red-500 placeholder:text-red-500 text-red-500"
                              : "border-slate-300"
                          } w-full xl:w-3/5 h-14 mt-2 border-solid border-2 rounded-lg px-2 focus:outline-none text-lg`}
                          placeholder="Enter video title"
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      {descriptionErrorMessage && (
                        <h1 className="text-sm text-center text-red-500">
                          {descriptionErrorMessage}
                        </h1>
                      )}
                      <div className="flex justify-center">
                        <input
                          type="text"
                          className={`${
                            descriptionErrorMessage
                              ? " border-red-500 placeholder:text-red-500 text-red-500"
                              : "border-slate-300"
                          } w-full xl:w-3/5 h-14 mt-2 border-solid border-2 rounded-lg px-2 focus:outline-none text-lg`}
                          placeholder="Enter video description"
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      {isUploading ? (
                        <div className="flex justify-center">
                          <button className="w-full xl:w-3/5 h-14 mt-2 bg-slate-600 transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer rounded-lg px-2 focus:outline-none text-lg flex justify-center items-center text-white">
                            Uploading <RingLoader />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div
                            className="w-full xl:w-3/5 h-14 mt-2 bg-slate-600 transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer rounded-lg px-2 focus:outline-none text-lg flex justify-center items-center text-white"
                            onClick={formHandler}
                          >
                            {videoPage ? "Upload video" : "Upload short"}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-center">
                        <div className="w-full xl:w-3/5 mt-2">
                          {progress > 0 && (
                            <ProgressBar
                              completed={progress}
                              bgColor="#6a1b9a"
                              height="20px"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              {video && video.type === "video/mp4" ? (
                ""
              ) : (
                <div className="flex gap-3 p-3">
                  <h1
                    className={`${
                      videoPage
                        ? "border-solid border-b-2 border-black font-bold"
                        : ""
                    } text-slate-600 cursor-pointer text-xl`}
                    onClick={videoPageSlider}
                  >
                    videos
                  </h1>
                  <h1
                    className={`${
                      shortPage
                        ? "border-solid border-b-2 border-black font-bold"
                        : ""
                    } text-slate-600 cursor-pointer text-xl`}
                    onClick={shortPageSlider}
                  >
                    shorts
                  </h1>
                </div>
              )}
              {videoSelectionErrorMessage && (
                <div className="select-error-message text-center">
                  <h1 className="text-sm text-red-500">
                    {videoSelectionErrorMessage}
                  </h1>
                </div>
              )}
              {video && video.type === "video/mp4" ? (
                ""
              ) : (
                <div className="video-selector w-full h-5/6 flex flex-col justify-center items-center gap-10">
                  <input
                    type="file"
                    id="video-select-id"
                    className="hidden"
                    onChange={(e) => setvideo(e.target.files[0])}
                  />
                  <img
                    src={VideoIcon}
                    alt=""
                    className={`${videoPage ? "invert" : ""} w-40 h-40`}
                  />
                  <div
                    className="w-1/2 h-14 flex justify-center items-center text-white bg-slate-600 rounded-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
                    onClick={videosSelectionHandler}
                  >
                    {videoPage ? "SELECT VIDEO" : "SELECT SHORT"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Upload;
