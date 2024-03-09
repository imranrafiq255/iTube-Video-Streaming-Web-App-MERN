import React, { useEffect, useRef } from "react";
import SearchIcon from "../../Assets/magnifying-glass.png";
import Notification from "../../Assets/bell.png";
import Logo from "../../Assets/logo.png";
import ProfileImage from "../../Assets/user.png";
import CreateVideo from "../../Assets/create-video.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction";
import { useSearch } from "../../Components/ContextApi/SearchContext";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef();
  const { setSearchData } = useSearch();
  const appNameClickHandler = () => {
    setSearchData("");
    navigate("/");
  };
  const profileNavigator = () => {
    setSearchData("");
    navigate("/profile");
  };
  const uploadVideoNavigator = () => {
    setSearchData("");
    navigate("/upload");
  };
  const notificationNavigator = () => {
    setSearchData("");
    navigate("/notification");
  };

  useEffect(() => {
    dispatch(loadUserAction());
    if (location.pathname === "/search") {
      searchRef.current.focus();
    }
  }, [dispatch, location]);
  const { loadedUser, authenticated } = useSelector(
    (state) => state.loadedUser
  );
  const searchHandler = () => {
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };
  const searchChange = (input) => {
    setSearchData(input);
  };
  return (
    <>
      <div
        className={`${
          location.pathname === "/shorts" ? "" : ""
        } header h-20 flex w-full items-center pt-3 sm:pt-16 bg-pink-50`}
      >
        <div
          className="app-name flex items-center justify-center cursor-pointer"
          onClick={appNameClickHandler}
        >
          <div className=" w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
            <img src={Logo} alt="" className=" invert w-8 h-8" />
          </div>
          <h1 className=" font-extrabold text-3xl ml-2">iTUBE</h1>
        </div>
        <div className="both-search-leftbar w-full flex items-center">
          <div className="search ml-28 xl:basis-3/5 2xl:basis-3/4 w-full justify-end items-center">
            <div className="w-full flex items-center justify-center">
              <div className="xl:w-2/3 md:relative flex w-full justify-center">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="search"
                  className=" hidden md:block w-full p-2.5 focus:outline-none border border-solid border-slate-400 rounded-full px-6 bg-transparent"
                  onClick={searchHandler}
                  onChange={(e) => searchChange(e.target.value)}
                />
                <img
                  src={SearchIcon}
                  alt=""
                  className=" w-7 h-7 md:absolute md:top-2 md:right-5"
                  onClick={searchHandler}
                />
              </div>
            </div>
          </div>
          <div className="header-left flex xl:basis-2/6 2xl:basis-1/6  items-center ">
            <div className="flex items-center justify-end xl:justify-between w-full">
              <div
                className="create-video hidden xl:block"
                onClick={uploadVideoNavigator}
              >
                <img
                  src={CreateVideo}
                  alt=""
                  className=" w-10 h-10 p-1.5 ml-6 cursor-pointer hover:bg-slate-200 rounded-full"
                />
              </div>
              <div className="notification hidden xl:block">
                <img
                  src={Notification}
                  alt=""
                  className="w-10 h-10 p-1.5 ml-6 cursor-pointer hover:bg-slate-200 rounded-full"
                  onClick={notificationNavigator}
                />
              </div>
              <div
                className="profile-image w-10 h-10 bg-slate-300 rounded-full ml-4"
                onClick={profileNavigator}
              >
                <img
                  src={
                    authenticated && loadedUser
                      ? loadedUser.currentUser?.userAvatar
                      : ProfileImage
                  }
                  alt=""
                  width={100}
                  height={50}
                  className={`${
                    authenticated ? "" : "invert"
                  } rounded-full block cursor-pointer`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
