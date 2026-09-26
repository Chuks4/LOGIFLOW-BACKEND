const { Country, State, City } = require("country-state-city");

const getCountries = () =>
  Country.getAllCountries().map(({ isoCode, name }) => ({
    code: isoCode,
    name,
  }));

const getStates = (countryCode) =>
  State.getStatesOfCountry(countryCode).map(({ isoCode, name }) => ({
    code: isoCode,
    name,
  }));

const getCities = (countryCode, stateCode) =>
  City.getCitiesOfState(countryCode, stateCode).map(({ name }) => ({ name }));

module.exports = { getCountries, getStates, getCities };
