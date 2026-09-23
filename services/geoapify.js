const {
  baseUrl,
  apiKey,
  VEHICLE_TYPES_PRICING,
  SHIPMENT_TYPES_PRICING,
} = require("../config/geoapify.config");
const axios = require("axios");
const { errorMsg } = require("../utils/util");

const calculateEstimatedShipmentCost = async (body) => {
  try {
    const {
      shipmentType,
      vehicleType,
      deliveryLat,
      deliveryLng,
      pickupLat,
      pickupLng,
    } = body;

    if (
      pickupLat < -90 ||
      pickupLat > 90 ||
      pickupLng < -180 ||
      pickupLng > 180 ||
      deliveryLat < -90 ||
      deliveryLat > 90 ||
      deliveryLng < -180 ||
      deliveryLng > 180
    ) {
      errorMsg("Invalid coordinates");
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        VEHICLE_TYPES_PRICING,
        vehicleType,
      ) ||
      !Object.prototype.hasOwnProperty.call(
        SHIPMENT_TYPES_PRICING,
        shipmentType,
      )
    ) {
      errorMsg("Invalid vehicle type or shipment type");
    }

    const vehicleTypePricing = VEHICLE_TYPES_PRICING[vehicleType];
    const pricePerKm = Number(vehicleTypePricing.distanceFee);
    const vehicleFee = Number(vehicleTypePricing.fee);
    const shipmentTypePricing = Number(
      SHIPMENT_TYPES_PRICING[shipmentType].price,
    );

    const { data } = await axios.get(`${baseUrl}/routing`, {
      params: {
        apiKey,
        waypoints: `${pickupLat},${pickupLng}|${deliveryLat},${deliveryLng}`,
        mode: vehicleType,
      },
    });

    if (data.features.length === 0 || !data.features[0]?.properties?.distance) {
      errorMsg("Unable to calculate route between the locations");
    }

    const distanceInMeters = data.features[0].properties.distance;
    const distanceInKm = distanceInMeters / 1000;
    const estimatedCost =
      distanceInKm * pricePerKm + vehicleFee + shipmentTypePricing;

    return {
      estimatedCost: Math.round(estimatedCost),
      distanceInKm,
      pricePerKm,
      vehicleFee,
      shipmentTypePricing,
    };
  } catch (error) {
    if (error.response?.data?.statusCode === 400) {
      throw error.response?.data?.message;
    }
    errorMsg("An error occurred while calculating the estimated shipment cost");
  }
};

const searchAddress = async (address) => {
  if (typeof address !== "string" || !address.trim()) {
    errorMsg("Address is required");
  }

  const { data } = await axios.get(`${baseUrl}/geocode/search`, {
    params: {
      apiKey,
      format: "geojson",
      limit: 1,
      text: address.trim(),
    },
  });

  const feature = data.features?.[0];
  if (!feature?.geometry?.coordinates || !feature.properties?.formatted) {
    errorMsg("Address not found");
  }

  const [longitude, latitude] = feature.geometry.coordinates;
  return {
    address: feature.properties.formatted,
    latitude,
    longitude,
  };
};

module.exports = {
  calculateEstimatedShipmentCost,
  searchAddress,
};
