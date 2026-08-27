const router = require("express").Router();
const {authAccess} = require("../middlewares/authAccess");
const geoapifyController = require("../controllers/geoapify");
const { validateCalculateShipmentCost } = require("../validators/geoapify");

/**
 * @swagger
 * /api/v1/geoapify:
 *  post:
 *    summary: Calculate shipment cost
 *    tags: [Geoapify]
 *    security:
 *      - bearerAuth: []
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
  validateCalculateShipmentCost,
  geoapifyController.calculateShpimentCost,
);

module.exports = router;