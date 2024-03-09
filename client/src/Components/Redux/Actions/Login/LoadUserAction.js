import axios from "axios";

const loadUserAction = () => async (dispatch) => {
  try {
    dispatch({
      type: "loadUserRequest",
    });
    const response = await axios.get("/api/v1/user/currentuser/");
    dispatch({
      type: "loadUserRequestSuccess",
      payload: await response.data,
    });
  } catch (error) {
    dispatch({
      type: "loadUserRequestFailure",
      payload: error.response.data,
    });
  }
};

export default loadUserAction;
