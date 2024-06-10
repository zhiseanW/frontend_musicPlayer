import axios from "axios";

import { url } from "./data";

export const getGenres = async () => {
  try {
    const res = await axios.get(`${url}/genres`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const addNewGenre = async (data) => {
  const res = await axios.post(`${url}/genres`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const updateGenre = async (data) => {
  const res = await axios.put(
    `${url}/genres/${data._id}`,
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

export const deleteGenre = async (data) => {
  const res = await axios.delete(`${url}/genres/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
