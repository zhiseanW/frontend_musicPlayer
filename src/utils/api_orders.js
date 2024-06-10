import axios from "axios";

import { url } from "./data";

export const getOrders = async (token) => {
  const res = await axios.get(`${url}/orders`, {
    headers: {
      Authorization: "Bearer " + token, // include token in the API
    },
  });
  return res.data;
};

export const addNewOrder = async (data) => {
  const res = await axios.post(
    `${url}/orders`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token, // include token in the API
      },
    }
  );
  return res.data;
};

export const updateOrder = async (data) => {
  const res = await axios.put(
    `${url}/orders/${data._id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token, // include token in the API
      },
    }
  );
  return res.data;
};

export const deleteOrder = async (data) => {
  const res = await axios.delete(`${url}/orders/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token, // include token in the API
    },
  });
  return res.data;
};
