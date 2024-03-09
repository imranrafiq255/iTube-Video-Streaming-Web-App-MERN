import React from "react";
// import ProfileImage from "../../Assets/user.png";
// import UnfilledHomeIcon from "../../Assets/home-icon.svg";
// import UnfilledShortIcon from "../../Assets/unfilled-shorts-icon.svg";
// import FilledAddIcon from "../../Assets/filled-add-icon.png";
// import UnfilledSubscriptionsIcon from "../../Assets/unfilled-subscriptions-icon.png";
// import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
const Add = () => {
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-full px-4 sm:px-20">
        <Header />
      </div>
    </>
  );
};

export default Add;
