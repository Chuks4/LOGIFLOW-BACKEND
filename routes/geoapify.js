const router = require("express").Router();
const { authAccess } = require("../middlewares/authAccess");
const geoapifyController = require("../controllers/geoapify");
const { validateCalculateShipmentCost } = require("../validators/geoapify");
const { body } = require("express-validator");
const { hasAccessTo } = require("../middlewares/authorize");

/**
 * @swagger
 * /api/v1/geoapify:
 *  post:
 *    summary: Calculate shipment cost
 *    tags: [Geoapify]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              shipmentType:
 *                type: string
 *                example: standard
 *              vehicleType:
 *                type: string
 *                example: bicycle
 *              deliveryLat:
 *                type: number
 *                example: 50.679023
 *              deliveryLng:
 *                type: number
 *                example: 4.569876
 *              pickupLat:
 *                type: number
 *                example: 50.661705
 *              pickupLng:
 *                type: number
 *                example: 4.578667
 *
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal server error
 */
router.post(
  "/",
  authAccess,
  hasAccessTo("shipments", "create"),
  validateCalculateShipmentCost,
  geoapifyController.calculateShpimentCost,
);

router.post(
  "/search",
  authAccess,
  hasAccessTo("shipments", "create"),
  body("address").trim().notEmpty().withMessage("Address is required"),
  geoapifyController.searchAddress,
);

module.exports = router;
