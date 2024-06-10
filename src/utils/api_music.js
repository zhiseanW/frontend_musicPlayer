import axios from "axios";

import { url } from "./data";

// export const uploadMusic = async (music) => {
//   const formData = new FormData();
//   formData.append("music", music);
//   const res = await axios.post(`${url}/musics`, formData, {
//     headers: {
//       "Content-Type": "audio/mpeg",
//     },
//   });
//   return res.data;
// };

export const getMusics = async (genre, artist, perPage, page) => {
  let params = {
    perPage: perPage,
    page: page,
  };
  if (genre !== "all") params.genre = genre;
  if (artist !== "all") params.artist = artist;
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/musics?${query.toString()}`);
  return res.data;
};

export const getMusic = async (id) => {
  const res = await axios.get(`${url}/musics/${id}`);
  return res.data;
};

export const addNewMusic = async (data) => {
  const res = await axios.post(`${url}/musics`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const updateMusic = async (data) => {
  console.log(data);
  const res = await axios.put(
    `${url}/musics/${data.id}`,
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

export const deleteMusic = async (data) => {
  const res = await axios.delete(`${url}/musics/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

export const addComment = async (data) => {
  const res = await axios.post(`${url}/comments`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
