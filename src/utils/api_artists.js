import axios from "axios";

import { url } from "./data";

export const getArtists = async () => {
  try {
    const res = await axios.get(`${url}/artists`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

export const addNewArtist = async (data) => {
  const res = await axios.post(`${url}/artists`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const updateArtist = async (data) => {
  const res = await axios.put(
    `${url}/artists/${data._id}`,
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

export const deleteArtist = async (data) => {
  const res = await axios.delete(`${url}/artists/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
