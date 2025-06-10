import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllProducts = async (page,limit) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/allproducts/all",
    headers: {
      "Content-Type": "application/json",
    },
    params:{
      page,
      limit
    }
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

export const addProducts = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: "/adminauth/product/add",
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

export const updateProducts = async (data, _id) => {
  const config = {
    method: "PATCH",
    maxBodyLength: Infinity,
    url: `/adminauth/product/edit/${_id}`,
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
