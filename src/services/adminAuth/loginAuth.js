import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";

export const LoginAuth = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "/admin/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    enqueueSnackbar(error.response.data.message, {
      variant: "error",
    });
  }
};

export const adminProfile = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/adminauth/profile",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    enqueueSnackbar(error.response.data.message, {
      variant: "error",
    });
  }
};

export const allregisterUsers = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/user/registered/users",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    enqueueSnackbar(error.response.data.message, {
      variant: "error",
    });
  }
};

export const userGetChats = async (targetId) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/user/admin/chat",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      targetId,
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    console.log(error.message);
  }
};

export const adminLogout = async () => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "/adminauth/logout",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    enqueueSnackbar(error.response.data.message, {
      variant: "error",
    });
  }
};
