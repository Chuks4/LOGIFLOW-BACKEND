const locationService = require("../services/locations");

const getCountries = (req, res) => {
  return res.status(200).json({ status: true, data: locationService.getCountries() });
};

const getStates = (req, res) => {
  const { countryCode } = req.params;
  return res.status(200).json({
    status: true,
    data: locationService.getStates(countryCode),
  });
};

const getCities = (req, res) => {
  const { countryCode, stateCode } = req.params;
  return res.status(200).json({
    status: true,
    data: locationService.getCities(countryCode, stateCode),
  });
};

module.exports = { getCountries, getStates, getCities };
