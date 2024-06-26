import axios from "axios";

const videosLoaderAction = () => async (dispatch) => {
  try {
    dispatch({
      type: "videosRequest",
    });
    const response = await axios.get("/api/v1/video/allvideos/");
    dispatch({
      type: "videosRequestSuccess",
      payload: await response.data,
    });
  } catch (error) {
    dispatch({
      type: "videosRequestFailure",
      payload: error.response.data.message,
    });
  }
};

export default videosLoaderAction;
