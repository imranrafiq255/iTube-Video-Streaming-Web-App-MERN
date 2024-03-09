import React from "react";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import Logo from "../../Assets/logo.png";
const ForgotPassword = () => {
  return (
    <>
      <BottomBar />
      <div className="forgot-container bg-pink-50 w-screen h-screen px-4 sm:px-6">
        <Header />
        <div className="forgot-form-container w-full flex items-center justify-center mt-40">
          <div className="forgot-form bg-white w-4/12">
            <div className="logo w-full flex justify-center mb-8">
              <div className="w-14 h-14 bg-slate-700 rounded flex items-center justify-center">
                <img src={Logo} alt="" className=" invert w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
