import axios from "axios";

import { url } from "./data";

export const verifyPayment = async (data) => {
  const res = await axios.post(`${url}/payment`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
