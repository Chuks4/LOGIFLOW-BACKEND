const NOTIFICATION_TYPES = {
  shipments: {
    // Shipment
    Pending: {
      title: "SHIPMENT_CREATED",
      message: "Your shipment has been created",
    },
    Assigned: {
      title: "SHIPMENT_ASSIGNED",
      message: "Your shipment has been assigned to a driver",
    },
    "Picked Up": {
      title: "SHIPMENT_PICKED_UP",
      message: "Your shipment has been picked up by the driver",
    },
    Delivered: {
      title: "SHIPMENT_IN_TRANSIT",
      message: "Your shipment has been delivered",
    },
    Cancelled: {
      title: "SHIPMENT_CANCELLED",
      message: "Your shipment has been cancelled",
    },
    Returned: {
      title: "SHIPMENT_RETURNED",
      message: "Your shipment has been returned",
    },
    "In Transit": {
      title: "SHIPMENT_IN_TRANSIT",
      message: "Your shipment is in transit",
    },
    Confirmed: {
      title: "SHIPMENT_CONFIRMED",
      message: "Your shipment has been confirmed, and ready for pickup",
    },
  },

  // Payment
  payments: {
    PAYMENT_SUCCESS: {
      title: "PAYMENT_SUCCESS",
      message: "Your payment was successful",
    },

    PAYMENT_FAILED: {
      title: "PAYMENT_FAILED",
      message: "Your payment failed",
    },
    PAYMENT_REFUNDED: {
      title: "PAYMENT_REFUNDED",
      message: "Your payment was refunded",
    },
  },
};

module.exports = { NOTIFICATION_TYPES };
