
import { API } from "../_api";

export const getContactMessages = async () => {
  const { data } = await API.get("/contact-messages", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  return data.data;
};
