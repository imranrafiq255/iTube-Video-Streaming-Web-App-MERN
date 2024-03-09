import axios from "axios";

const shortsLoaderAction = () => async (dispatch) => {
  try {
    dispatch({
      type: "shortsRequest",
    });
    const response = await axios.get("/api/v1/short/allshorts/");
    dispatch({
      type: "shortsRequestSuccess",
      payload: await response.data,
    });
  } catch (error) {
    dispatch({
      type: "shortsRequestFailure",
      payload: error.response.data.message,
    });
  }
};

export default shortsLoaderAction;
