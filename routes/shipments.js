const router = require("express").Router();
const shipmentController = require("../controllers/shipments");
const authAccess = require("../middlewares/authAccess");
const { validateCreateShipment } = require("../validators/shipments");

/**
 * @swagger
 * /api/v1/shipments:
 *   post:
 *     summary: Create a new shipment
 *     description: Create a new shipment
 *     tags:
 *       - Shipments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupAddress
 *               - deliveryAddress
 *               - pickupLatitude
 *               - pickupLongitude
 *               - deliveryLatitude
 *               - deliveryLongitude
 *               - shipmentType
 *               - estimatedCost
 *               - recipientName
 *               - recipientPhone
 *               - items
 *             properties:
 *               pickupAddress:
 *                 type: string
 *                 example: "12 Allen Avenue, Ikeja, Lagos"
 *               deliveryAddress:
 *                 type: string
 *                 example: "25 Admiralty Way, Lekki, Lagos"
 *               pickupLatitude:
 *                 type: number
 *                 example: 6.6018
 *               pickupLongitude:
 *                 type: number
 *                 example: 3.3515
 *               deliveryLatitude:
 *                 type: number
 *                 example: 6.4281
 *               deliveryLongitude:
 *                 type: number
 *                 example: 3.4219
 *               shipmentType:
 *                 type: string
 *                 example: "Standard"
 *               estimatedCost:
 *                 type: number
 *                 example: 5000
 *               recipientName:
 *                 type: string
 *                 example: "John Doe"
 *               recipientPhone:
 *                 type: string
 *                 example: "08012345678"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemName
 *                     - quantity
 *                     - isFragile
 *                   properties:
 *                     itemName:
 *                       type: string
 *                       example: "Laptop"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     weight:
 *                       type: number
 *                       example: 2.5
 *                     length:
 *                       type: number
 *                       example: 30
 *                     width:
 *                       type: number
 *                       example: 20
 *                     height:
 *                       type: number
 *                       example: 5
 *                     declaredValue:
 *                       type: number
 *                       example: 500000
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     isFragile:
 *                       type: boolean
 *                       example: true
 *                     color:
 *                       type: string
 *                       example: "Black"
 *                     specialInstructions:
 *                       type: string
 *                       example: "Handle with care"
 *
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/", authAccess, validateCreateShipment, shipmentController.create);

/**
 * @swagger
 * /api/v1/shipments:
 *   get:
 *     summary: Get all shipments
 *     description: Retrieve all shipments with pagination and optional filtering
 *     tags:
 *       - Shipments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         description: Number of shipments per page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           example: 10
 *
 *       - in: query
 *         name: keyword
 *         description: Search shipments by keyword
 *         required: false
 *         schema:
 *           type: string
 *           example: "Lagos"
 *
 *       - in: query
 *         name: customerId
 *         description: Filter shipments by customer ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *       - in: query
 *         name: driverId
 *         description: Filter shipments by driver ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *       - in: query
 *         name: dispatcherId
 *         description: Filter shipments by dispatcher ID
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authAccess, shipmentController.getAll);

/**
 * @swagger
 * /api/v1/shipments/{id}:
 *   get:
 *     summary: Get a shipment by ID
 *     description: Retrieve a shipment by its unique ID
 *     tags:
 *       - Shipments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Shipment ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Shipment retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authAccess, shipmentController.getById);

/**
 * @swagger
 * /api/v1/shipments/{id}:
 *   put:
 *     summary: Update shipment status
 *     description: Update the status of a shipment by its unique ID
 *     tags:
 *       - Shipments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Shipment ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - Pending
 *                   - Assigned
 *                   - Picked Up
 *                   - In Transit
 *                   - Delivered
 *                   - Returned
 *                   - Cancelled
 *                 example: "Pending"
 *     responses:
 *       200:
 *         description: Shipment status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authAccess, shipmentController.updateStatus);

/**
 * @swagger
 * /api/v1/shipments/{shipmentId}/{driverId}/assign-driver:
 *   put:
 *     summary: Assign a driver to a shipment
 *     description: Assign a driver to a shipment by its unique ID
 *     tags:
 *       - Shipments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipmentId
 *         description: Shipment ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: driverId
 *         description: Driver ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shipment or driver or dispatcher not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:shipmentId/:driverId/assign-driver",
  authAccess,
  shipmentController.assignDriver,
);

module.exports = router;
