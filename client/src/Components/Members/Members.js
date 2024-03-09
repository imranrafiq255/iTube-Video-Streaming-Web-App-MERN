import React, { useEffect } from "react";
import Boy from "../../Assets/boy.jpg";
import Header from "../Header/Header";
import BottomBar from "../BottomBar/BottomBar";
import "./Members.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loginAction from "../Redux/Actions/Login/LoginAction.js";
import loadUserAction from "../Redux/Actions/Login/LoadUserAction.js";
import LoaderCircles from "../Loader/LoaderCircles.js";
const Members = () => {
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      dispatch(loginAction(user));
    }
    dispatch(loadUserAction());
  }, []);
  const { loadedUser, authenticated, loading } = useSelector(
    (state) => state.loadedUser
  );
  useEffect(() => {
    if (!loading && !authenticated && !isAuthenticated && !isLoading) {
      loginWithRedirect();
      if (user) {
        dispatch(loginAction(user));
      }
    }
  });
  const visitProfileHandler = (id) => {
    navigate(`/account/user/${id}`);
  };
  return (
    <>
      <BottomBar />
      <div className="bg-pink-50 w-screen h-screen px-4 sm:px-20">
        <Header />
        {isLoading || loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoaderCircles />
          </div>
        ) : (
          <div className="members-container bg-pink-50">
            <div className="all-subscribers-text mt-3">
              <h1 className="text-2xl font-bold">All Subscribers</h1>
            </div>
            <div className="subscribers-container mt-6">
              {loadedUser &&
              Array.isArray(loadedUser?.currentUser?.subscribers) &&
              loadedUser?.currentUser?.subscribers.length > 0
                ? loadedUser?.currentUser?.subscribers.map((subscriber) => (
                    <div className="subscriber mb-5">
                      <div className="flex">
                        <div className="basis-1/5 flex justify-center">
                          {subscriber && subscriber.userAvatar ? (
                            <img
                              src={subscriber.userAvatar}
                              alt=""
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="flex flex-col justify-center basis-2/5">
                          <h1 className="text-xl font-semi-bold text-slate-700 line-clamp-member-2">
                            {subscriber ? subscriber.userChannel : ""}
                          </h1>
                          <h1 className=" text-xs">
                            {subscriber ? subscriber.subscribers.length : ""}{" "}
                            subscribers
                          </h1>
                        </div>
                        <div className="div-visit-button flex justify-center items-center basis-2/5">
                          <button
                            className=" bg-slate-700 border-none w-full text-white rounded h-full"
                            onClick={() => visitProfileHandler(subscriber._id)}
                          >
                            Visit Profile
                          </button>
                        </div>
                      </div>
                      <div className="bottom-line bg-slate-400"></div>
                    </div>
                  ))
                : "no subscriber"}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Members;
