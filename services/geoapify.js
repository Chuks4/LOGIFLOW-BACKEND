const { baseUrl, apiKey } = require("../config/geoapify.config");
const axios = require("axios");

const calculateEstimatedShipmentCost = async (distance) => {
  const { data } = await axios.get(`${baseUrl}/geocode`);
  
};
