import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllCategory = async (page, limit) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/category/all",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      page,
      limit,
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

export const addCategory = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "/adminauth/category/add",
    headers: {
      "Content-Type": "multipart/form-data",
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

export const updateCategory = async (data, _id) => {
  const config = {
    method: "PATCH",
    maxBodyLength: Infinity,
    url: `/adminauth/category/edit/${_id}`,
    headers: {
      "Content-Type": "multipart/form-data",
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
