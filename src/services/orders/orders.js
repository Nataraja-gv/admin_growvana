import { enqueueSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllOrders = async (orderStatus) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/user/order/all",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      orderStatus,
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

export const updateOrderStatus = async (data) => {
  const config = {
    method: "PATCH",
    maxBodyLength: Infinity,
    url: "/user/order/status/update",
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
