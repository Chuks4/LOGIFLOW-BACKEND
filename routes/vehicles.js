const vehicleController = require("../controllers/vehicle");
const router = require("express").Router();
const { validateCreateVehicle } = require("../validators/vehicles");
const { authAccess } = require("../middlewares/authAccess");

/**
 * @swagger
 * /api/v1/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     description: Create a new vehicle
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - year
 *               - model
 *               - plateNumber
 *               - type
 *               - capacity
 *             properties:
 *               year:
 *                 type: integer
 *                 example: 2020
 *               model:
 *                 type: string
 *                 example: "Toyota"
 *               plateNumber:
 *                 type: string
 *                 example: "ABC123"
 *               type:
 *                 type: string
 *                 example: "Car"
 *               capacity:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vehicle created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     year:
 *                       type: integer
 *                       example: 2020
 *                     model:
 *                       type: string
 *                       example: "Toyota"
 *                     plateNumber:
 *                       type: string
 *                       example: "ABC123"
 *                     type:
 *                       type: string
 *                       example: "Car"
 *                     capacity:
 *                       type: number
 *                       example: 1500
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.post("/", authAccess, validateCreateVehicle, vehicleController.create);

/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     summary: Get all vehicles
 *     description: Retrieve all vehicles with pagination and optional filtering
 *     tags:
 *       - Vehicles
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
 *         description: Number of vehicles per page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *           example: 10
 *
 *       - in: query
 *         name: keyword
 *         description: Search by vehicle type or plate number
 *         required: false
 *         schema:
 *           type: string
 *           example: "Toyota"
 *
 *       - in: query
 *         name: status
 *         description: Filter vehicles by status
 *         required: false
 *         schema:
 *           type: string
 *           example: Available
 *
 *     responses:
 *       200:
 *         description: Vehicles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       year:
 *                         type: integer
 *                         example: 2020
 *                       model:
 *                         type: string
 *                         example: "Toyota"
 *                       plateNumber:
 *                         type: string
 *                         example: "ABC123"
 *                       type:
 *                         type: string
 *                         example: "Car"
 *                       capacity:
 *                         type: number
 *                         example: 1500
 *                       status:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-23T19:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-08-23T19:30:00.000Z"
 *
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authAccess, vehicleController.getAll);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   get:
 *     summary: Get a vehicle by ID
 *     description: Retrieve a vehicle by its unique ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Vehicle ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Vehicle retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vehicle retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     year:
 *                       type: integer
 *                       example: 2020
 *                     model:
 *                       type: string
 *                       example: "Toyota"
 *                     plateNumber:
 *                       type: string
 *                       example: "ABC123"
 *                     type:
 *                       type: string
 *                       example: "Car"
 *                     capacity:
 *                       type: number
 *                       example: 1500
 *                     status:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authAccess, vehicleController.getById);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     description: Update a vehicle by its unique ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Vehicle ID
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
 *               - year
 *               - model
 *               - plateNumber
 *               - type
 *             properties:
 *               year:
 *                 type: integer
 *                 example: 2020
 *               model:
 *                 type: string
 *                 example: "Toyota"
 *               plateNumber:
 *                 type: string
 *                 example: "ABC123"
 *               type:
 *                 type: string
 *                 example: "Car"
 *               capacity:
 *                 type: number
 *                 example: 1500
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vehicle updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     year:
 *                       type: integer
 *                       example: 2020
 *                     model:
 *                       type: string
 *                       example: "Toyota"
 *                     plateNumber:
 *                       type: string
 *                       example: "ABC123"
 *                     type:
 *                       type: string
 *                       example: "Car"
 *                     capacity:
 *                       type: number
 *                       example: 1500
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authAccess, vehicleController.update);

/**
 * @swagger
 * /api/v1/vehicles/{id}/driver:
 *   patch:
 *     summary: Assign a driver to a vehicle
 *     description: Assign a driver to a vehicle by its unique ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Vehicle ID
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
 *               - driverId
 *             properties:
 *               driverId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Driver assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     year:
 *                       type: integer
 *                       example: 2020
 *                     model:
 *                       type: string
 *                       example: "Toyota"
 *                     plateNumber:
 *                       type: string
 *                       example: "ABC123"
 *                     type:
 *                       type: string
 *                       example: "Car"
 *                     capacity:
 *                       type: number
 *                       example: 1500
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-23T19:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/driver", authAccess, vehicleController.assignDriver);

/**
 * @swagger
 * /api/v1/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle by its unique ID
 *     description: Delete a vehicle by its unique ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Vehicle ID
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   format: uuid
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authAccess, vehicleController.deleteById);

module.exports = router;
