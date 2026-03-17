import axiosInstance from "./axiosinstance";
import toast from "react-hot-toast";

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


