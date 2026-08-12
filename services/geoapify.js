const {
  baseUrl,
  apiKey,
  VEHICLE_TYPES_PRICING,
  SHIPMENT_TYPES_PRICING,
} = require("../config/geoapify.config");
const axios = require("axios");

const calculateEstimatedShipmentCost = async (data) => {
  const {
    shipmentType,
    vehicleType,
    deliveryLat,
    deliveryLng,
    pickupLat,
    pickupLng,
  } = data;

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
    const error = new Error("Invalid coordinates");
    error.status = 400;
    throw error;
  }

  if (
    !Object.prototype.hasOwnProperty.call(VEHICLE_TYPES_PRICING, vehicleType) ||
    !Object.prototype.hasOwnProperty.call(SHIPMENT_TYPES_PRICING, shipmentType)
  ) {
    const error = new Error("Invalid vehicle type or shipment type");
    error.status = 400;
    throw error;
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

  if (!data.results?.length || !data.results[0]?.legs?.length) {
    const error = new Error("Unable to calculate route between the locations");
    error.status = 400;
    throw error;
  }

  const distanceInMeters = data.results[0].distance;
  const distanceInKm = distanceInMeters / 1000;
  const estimatedCost =
    distanceInKm * pricePerKm + vehicleFee + shipmentTypePricing;

  return {
    estimatedCost,
    distanceInKm,
    pricePerKm,
    vehicleFee,
    shipmentTypePricing,
  };
};

module.exports = {
  calculateEstimatedShipmentCost,
};
