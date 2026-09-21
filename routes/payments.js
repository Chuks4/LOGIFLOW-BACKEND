const router = require("express").Router();
const paymentController = require("../controllers/payment");
const { authAccess } = require("../middlewares/authAccess");

/**
 * @swagger
 * /api/v1/payments/initialize:
 *   post:
 *     summary: Initialize payment
 *     description: Initialize a payment for a shipment.
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - amount
 *               - shipmentId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *                 example: user@example.com
 *               amount:
 *                 type: number
 *                 description: Amount to be paid
 *                 example: 1000
 *               shipmentId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the shipment
 *                 example: 5f8e880c-0e8c-11ed-9c12-0242ac130003
 *     responses:
 *       200:
 *         description: Payment initialized successfully
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
 *                   example: Payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                       example: https://checkout.paystack.com/example
 *                     access_code:
 *                       type: string
 *                       example: example-access-code
 *                     reference:
 *                       type: string
 *                       example: PAY-123456789
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.post("/initialize", authAccess, paymentController.initPayment);

router.post("/webhook", paymentController.processPaymentWebhooks);

/**
 * @swagger
 * /api/v1/payments/user:
 *   get:
 *     summary: Get user payment histories
 *     description: Get all payment history
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: Search by payment reference
 *         required: false
 *         schema:
 *           type: string
 *
 *       - in: query
 *         name: status
 *         description: Filter by payment status ("pending", "completed", "failed", "refunded")
 *         required: false
 *         schema:
 *           type: string
 *           example: pending
 *
 *       - in: query
 *         name: limit
 *         description: The number of records to return
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *
 *       - in: query
 *         name: page
 *         description: The page number to return
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get("/user", authAccess, paymentController.userPaymentsHistory);

/**
 * @swagger
 * /api/v1/payments/user:
 *   get:
 *     summary: Get user payment history by id
 *     description: Get payment history by id
 *     tags:
 *       - Payments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         description: Enter payment id
 *         required: true
 *         schema:
 *           type: uuid
 *           example: 5f8e880c-0e8c-11ed-9c12-0242ac130003
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get("/user/:id", authAccess, paymentController.getById);

module.exports = router;
