const express = require("express");

const axios = require("axios");

const findweather = async (req, res) => {
  try {
    const params = {
      access_key: req.body.access_key,
      query: req.body.query,
    };
    const url = "http://api.weatherstack.com/current?";
    const getLocation = await axios
      .get(url, { params })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
    res.send(getLocation);
    console.log("Location Fetched");
  } catch {
    console.log("Error");
  }
};
module.exports = { findweather };
