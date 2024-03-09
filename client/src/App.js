import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Components/Home/Home";
import Shorts from "./Components/Shorts/Shorts";
import Add from "./Components/Add/Add.js";
import Member from "./Components/Members/Members.js";
import Profile from "./Components/Profile/Profile.js";
import VideoPlay from "./Components/VideoPlay/VideoPlay.js";
import Upload from "./Components/Upload/Upload.js";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword.js";
import Account from "./Components/Account/Account.js";
import Notification from "./Components/Notification/Notification.js";
import Search from "./Components/Search/Search.js";
import { SearchProvider } from "./Components/ContextApi/SearchContext.js";
const App = () => {
  return (
    <>
      {" "}
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/add" element={<Add />} />
            <Route path="/members" element={<Member />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/playvideo" element={<VideoPlay />} />
            <Route path="/upload" element={<Upload />} />
            {/* <Route path="/signin" element={<SignIn />} /> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/account/user/:id" element={<Account />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Router>
      </SearchProvider>
    </>
  );
};

export default App;
