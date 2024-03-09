import axios from "axios";
const loginAction = (user) => async (dispatch) => {
  try {
    dispatch({
      type: "loginRequest",
    });
    const response = await axios.post("/api/v1/user/login", { user });
    dispatch({
      type: "loginSuccessRequest",
      payload: await response.data,
    });
  } catch (error) {
    dispatch({
      type: "loginFailureRequest",
      payload: error.response.data,
    });
  }
};

export default loginAction;
