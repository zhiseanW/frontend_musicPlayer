import axios from "axios";

import { url } from "./data";

export const getComments = async () => {
  try {
    const res = await axios.get(`${url}/comments`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const addNewComment = async (data) => {
  const res = await axios.post(`${url}/comments`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const updateComment = async (data) => {
  const res = await axios.put(
    `${url}/comments/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return res.data;
};

export const deleteComment = async (data) => {
  const res = await axios.delete(`${url}/comments/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
