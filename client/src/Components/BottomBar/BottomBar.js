import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UnfilledHomeIcon from "../../Assets/home-icon.svg";
import FilledHomeIcon from "../../Assets/filled-home-icon.svg";
import UnfilledShortIcon from "../../Assets/unfilled-shorts-icon.svg";
import FilledShortIcon from "../../Assets/filled-shorts-icon.svg";
import UnfilledAddIcon from "../../Assets/unfilled-add-icon.png";
import FilledAddIcon from "../../Assets/filled-add-icon.png";
import FilledSubscriptionsIcon from "../../Assets/filled-subscriptions-icon.png";
import UnfilledSubscriptionsIcon from "../../Assets/unfilled-subscriptions-icon.png";
import ProfileFilledIcon from "../../Assets/filled-profile.png";
import ProfileUnfilledIcon from "../../Assets/unfilled-profile.png";
import { useDispatch, useSelector } from "react-redux";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction";
const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const homeClick = () => {
    navigate("/");
  };
  const shortClick = () => {
    navigate("/shorts");
  };
  const addClick = () => {
    navigate("/upload");
  };
  const memberClick = () => {
    navigate("/members");
  };
  const profileClick = () => {
    navigate("/profile");
  };

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);
  const { loadedUser } = useSelector((state) => state.loadedUser);
  return (
    <>
      <div className="fixed flex items-center justify-around xl:hidden bottom-0 z-10 bottom-header w-full h-14 sm:h-16 bg-white border-t-2 border-slate-300">
        <div
          className="Home flex flex-col justify-center items-center cursor-pointer"
          onClick={homeClick}
        >
          <img
            src={location.pathname === "/" ? FilledHomeIcon : UnfilledHomeIcon}
            alt=""
            className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10"
          />
          <div>
            <h6 className=" text-xs">Home</h6>
          </div>
        </div>
        <div
          className="Short flex flex-col justify-center items-center cursor-pointer"
          onClick={shortClick}
        >
          <img
            src={
              location.pathname === "/shorts"
                ? FilledShortIcon
                : UnfilledShortIcon
            }
            alt=""
            className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10"
          />
          <div>
            <h6 className=" text-xs">Shorts</h6>
          </div>
        </div>
        <div
          className="Add flex flex-col justify-center items-center cursor-pointer"
          onClick={addClick}
        >
          <img
            src={location.pathname === "/add" ? FilledAddIcon : UnfilledAddIcon}
            alt=""
            className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10"
          />
          <div>
            <h6 className=" text-xs">Add</h6>
          </div>
        </div>
        <div
          className="Subscriptions flex flex-col justify-center items-center cursor-pointer"
          onClick={memberClick}
        >
          <img
            src={
              location.pathname === "/members"
                ? FilledSubscriptionsIcon
                : UnfilledSubscriptionsIcon
            }
            alt=""
            className="w-7 sm:w-8 md:w-10 h-7 sm:h-8 md:h-10"
          />
          <div>
            <h6 className=" text-xs">Members</h6>
          </div>
        </div>
        <div
          className="Profile flex flex-col justify-center items-center cursor-pointer"
          onClick={profileClick}
        >
          <img
            src={
              loadedUser && loadedUser?.currentUser?.userAvatar
                ? loadedUser?.currentUser?.userAvatar
                : location.pathname === "/profile"
                ? ProfileFilledIcon
                : ProfileUnfilledIcon
            }
            alt=""
            className={`w-9 sm:w-16 md:w-16 h-9 sm:h-16 md:h-16 ${
              location.pathname === "/profile"
                ? "border border-solid border-spacing-12 border-slate-900 rounded-full"
                : "rounded-full"
            }`}
          />
          <div>
            <h6 className=" text-xs">You</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomBar;
