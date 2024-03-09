// import React, { useEffect, useRef, useState } from "react";
// import "./SignIn.css";
// import Logo from "../../Assets/logo.png";
// import View from "../../Assets/view.png";
// import Hide from "../../Assets/hide.png";
// import GoogleIcon from "../../Assets/Google-icon.png";
// import CrossIcon from "../../Assets/close-sign.png";
// import EmailIcon from "../../Assets/mail-icon.png";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// const SignIn = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const eyeToggleRef = useRef();
//   const [openSignInForm, setSignInForm] = useState(true);
//   let hide = true;
//   const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       loginWithRedirect();
//     }
//   }, [isAuthenticated, loginWithRedirect, isLoading]);
//   const googleAuthenticationHandler = () => {
//     loginWithRedirect();
//   };
//   const eyeToggleHandler = () => {
//     const passwordInput = document.getElementById("password");
//     if (hide) {
//       eyeToggleRef.current.src = Hide;
//       passwordInput.type = "text";
//       hide = false;
//     } else {
//       eyeToggleRef.current.src = View;
//       passwordInput.type = "password";
//       hide = true;
//     }
//   };
//   const crossClickHandler = () => {
//     if (openSignInForm) {
//       setSignInForm(false);
//       navigate(location.pathname);
//       window.location.reload();
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <div className="w-screen h-screen flex justify-center items-center">
//           <p>loading ....</p>
//         </div>
//       ) : (
//         openSignInForm && (
//           <div
//             className={`signin-container overflow-hidden w-full h-full bg-black bg-opacity-80 flex items-center justify-center fixed top-0 left-0 z-20`}
//           >
//             <div className="sigin w-full h-full lg:w-8/12 lg:h-full 2xl:w-4/12 2xl:h-4/5 bg-white bg-opacity-100 2xl:rounded-3xl flex flex-col justify-center relative">
//               <div className="logo w-full flex justify-center mb-8">
//                 <div className="w-14 h-14 bg-slate-700 rounded flex items-center justify-center">
//                   <img src={Logo} alt="" className=" invert w-12 h-12" />
//                 </div>
//               </div>
//               <div className="welcome-text mt-3">
//                 <h1 className="text-center text-3xl font-extrabold font-sans text-slate-700">
//                   Welcome to iTUBE
//                 </h1>
//               </div>
//               <div className="form w-full flex flex-col items-center mt-4">
//                 <div className="email w-10/12 xl:w-8/12 2xl:w-8/12 flex flex-col">
//                   <label
//                     htmlFor="email"
//                     className="cursor-pointer ml-5 text-slate-600"
//                   >
//                     Email address
//                   </label>
//                   <div className="w-full relative">
//                     <input
//                       type="email"
//                       id="email"
//                       className="w-full border-solid border-2 border-slate-400 hover:outline-none h-14 rounded-3xl text-xl placeholder:text-xl placeholder:text-slate-700 px-4 text-slate-800 pr-14"
//                       placeholder="Email"
//                     />
//                     <img
//                       src={EmailIcon}
//                       alt=""
//                       className="w-6 h-6 absolute top-4 right-7"
//                     />
//                   </div>
//                 </div>
//                 <div className="password w-10/12 xl:w-8/12 2xl:w-8/12 flex flex-col">
//                   <label
//                     htmlFor="password"
//                     className="cursor-pointer ml-5 text-slate-600"
//                   >
//                     Password
//                   </label>
//                   <div className="relative w-full">
//                     <input
//                       type="password"
//                       id="password"
//                       className="border-solid border-2 border-slate-400 hover:outline-none h-14 rounded-3xl text-xl placeholder:text-xl placeholder:text-slate-700 pl-4 pr-14 text-slate-800 w-full"
//                       placeholder="Password"
//                     />
//                     <img
//                       src={View}
//                       ref={eyeToggleRef}
//                       alt=""
//                       className="w-6 h-6 absolute top-4 right-7 cursor-pointer"
//                       onClick={eyeToggleHandler}
//                     />
//                   </div>
//                 </div>
//                 <div className="forgot-password w-8/12 mt-2">
//                   <h1 className="text-slate-600 font-bold ml-4 cursor-pointer hover:text-slate-900 hover:underline inline-block">
//                     Forgotten your password?
//                   </h1>
//                 </div>
//                 <div className="submit-btn w-10/12 xl:w-8/12 2xl:w-8/12 mt-4">
//                   <button className="w-full bg-slate-700 text-white h-12 rounded-3xl border-none font-semibold bg-gradient-to-tr from-slate-700 to-slate-500 hover:bg-gradient-to-tr hover:from-slate-800 hover:to-slate-800">
//                     Log in
//                   </button>
//                 </div>
//                 <div className="OR w-10/12 xl:w-8/12 2xl:w-8/12 my-5">
//                   <h1 className="text-center text-bold text-sm text-slate-400 font-sans">
//                     OR
//                   </h1>
//                 </div>
//                 <div
//                   className="submit-btn w-10/12 xl:w-8/12 2xl:w-8/12 border-solid border-2 border-slate-700 h-12 rounded-3xl font-semibold hover:bg-gradient-to-tr hover:from-slate-800 hover:to-slate-800 flex justify-center hover:text-white cursor-pointer"
//                   onClick={googleAuthenticationHandler}
//                 >
//                   <div className="h-full flex items-center">
//                     <img src={GoogleIcon} alt="" className="w-6 h-6" />
//                   </div>
//                   <div className="text h-full flex items-center ml-2">
//                     <h1 className="">Continue with Google</h1>
//                   </div>
//                 </div>
//                 <div className="w-10/12 xl:w-8/12 2xl:w-8/12 my-5">
//                   <h1 className="text-center text-bold text-sm text-slate-400 font-sans">
//                     By continuing, you agree to iTUBE's{" "}
//                     <span className="font-bold text-slate-800">
//                       Terms of Service
//                     </span>{" "}
//                     Opens a new tab and acknowledge that you've read our{" "}
//                     <span className="font-bold text-slate-800">
//                       Privacy Policy
//                     </span>
//                   </h1>
//                 </div>
//                 <div
//                   className="line w-4/12 bg-slate-300"
//                   style={{ height: "0.2px" }}
//                 ></div>
//                 <div className="signup my-5">
//                   <h1 className="text-slate-800 text-sm font-bold">
//                     Not on iTUBE?{" "}
//                     <span className="text-slate-800 font-bold text-sm cursor-pointer hover:underline">
//                       Sign up
//                     </span>
//                   </h1>
//                 </div>
//               </div>
//               <div
//                 className="cross absolute top-10 right-10 cursor-pointer hover:bg-slate-200 rounded-full p-3"
//                 onClick={crossClickHandler}
//               >
//                 <img src={CrossIcon} alt="" className="w-5 h-5" />
//               </div>
//             </div>
//           </div>
//         )
//       )}
//     </>
//   );
// };

// export default SignIn;
