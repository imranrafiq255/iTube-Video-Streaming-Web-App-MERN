import React from "react";
import BottomBar from "../BottomBar/BottomBar";
import Header from "../Header/Header";
import NotificationIcon from "../../Assets/notification-icon.png";
const Notification = () => {
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-full h-screen px-4 sm:px-6">
        <Header />
        <div className="flex flex-col bg-pink-50 w-full h-full justify-center items-center">
          <img src={NotificationIcon} alt="" className="w-20 h-20" />
          <h1 className="text-xl mt-5 font-bold text-slate-700">
            No Notification Received Yet!
          </h1>
        </div>
      </div>
    </>
  );
};

export default Notification;
