import axios from "axios";

import { url } from "./data";

export const getUser = async (id) => {
  const res = await axios.get(`${url}/users/`);
  return res.data;
};

export const updateUser = async (data) => {
  const response = await axios.put(
    `${url}/users/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(
    `${url}/users/login`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const signUpUser = async (data) => {
  const response = await axios.post(
    `${url}/users/signup`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
