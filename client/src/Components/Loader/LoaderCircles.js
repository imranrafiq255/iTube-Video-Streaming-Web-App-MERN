import React from "react";
import { Circles } from "react-loader-spinner";
const LoaderCircles = () => {
  return (
    <Circles
      height="80"
      width="40"
      color="#334155"
      ariaLabel="circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export default LoaderCircles;
