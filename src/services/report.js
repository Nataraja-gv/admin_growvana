import axiosInstance from "../utils/axiosInstance";

export const OverAllReport = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: "/dashboard/overAll/details",
    headers: {
      "content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    console.log(error.message);
  }
};
