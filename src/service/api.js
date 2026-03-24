import axiosInstance from "./axiosinstance";

export const createUser = async (data) => {
  try {
    const res = await axiosInstance.post(`/user/`, data);
    return res;
  } catch (error) {
    const errorMessage =
      error.response.data.message || error.message || "Create User  Error";
    console.log(errorMessage);
  }
};

export const createSession = async (data) => {
  try {
    const res = await axiosInstance.post(`/session/`, data);
    return res;
  } catch (error) {
    const errorMessage =
      error.response.data.message || error.message || "Create Session Error";
    console.log(errorMessage);
  }
};

export const createEvent = async (data) => {
  try {
    const res = await axiosInstance.post(`/event/`, data);
    return res;
  } catch (error) {
    const errorMessage =
      error.response.data.message || error.message || "Create Event Error";
    console.log(errorMessage);
  }
};

export const featchSimilarProduct = async (productId,userId)=>{
  try {
    const res = await axiosInstance.post(`/similar/${productId}`,{userId});
    return res;
  } catch (error) {
    const errorMessage =
      error.response.data.message || error.message || "featch SimilarProduct Error";
    console.log(errorMessage);
  }
}



