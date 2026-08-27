const router = require("express").Router();
const paymentController = require("../controllers/payment");
const { authAccess } = require("../middlewares/authAccess");

/**
 * @swagger
 * /api/payments:
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
module.exports = router