const VEHICLE_TYPES_PRICING = {
  truck: {
    fee: process.env.TRUCK_FEE,
    distanceFee: process.env.TRUCK_PRICE_PER_KM,
  },
  motorcycle: {
    fee: process.env.MOTORCYCLE_FEE,
    distanceFee: process.env.MOTORCYCLE_PRICE_PER_KM,
  },
  bicycle: {
    fee: process.env.BICYCLE_FEE,
    distanceFee: process.env.BICYCLE_PRICE_PER_KM,
  },
};

const SHIPMENT_TYPES_PRICING = {
  // TODO: add pricing for different shipment types
  standard: {
    price: 2000,
  },
  express: {
    price: 5000,
  },
  fragile: {
    price: 10000,
  },
};

module.exports = {
  baseUrl: process.env.GEOAPIFY_BASE_URL,
  apiKey: process.env.GEOAPIFY_API_KEY,
  VEHICLE_TYPES_PRICING,
  SHIPMENT_TYPES_PRICING,
};
