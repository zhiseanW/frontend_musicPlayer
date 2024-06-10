import axios from "axios";

import { url } from "./data";

export const getUser = async (data) => {
  console.log(data);
  const res = await axios.get(`${url}/users/${data._id}`);
  return res.data;
};
export const getUsers = async () => {
  const res = await axios.get(`${url}/users`);
  return res.data;
};

export const updateUser = async (data) => {
  const res = await axios.put(
    `${url}/users/${data._id}`,
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

export const loginUser = async (data) => {
  const res = await axios.post(`${url}/users/login`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const signUpUser = async (data) => {
  const res = await axios.post(`${url}/users/signup`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
