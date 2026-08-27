const router = require("express").Router();
const userController = require("../controllers/users");
const {authAccess} = require("../middlewares/authAccess");
const handleUpload = require("../middlewares/uploads");

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: Search by firstname or lastname
 *         required: false
 *         schema:
 *           type: string
 * 
 *       - in: query
 *         name: filterByRoles
 *         description: Filter by role role (customer:customer, driver:driver)
 *         required: false
 *         schema:
 *           type: string
 *           example: customer
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
 *         description: Users retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get("/", authAccess, userController.getCustomers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *
 *       401:
 *         description: Unauthorized - No token provided
 *
 *       403:
 *         description: Forbidden
 *
 *       404:
 *         description: Not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:id", authAccess, userController.getById);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Chukwuemeka
 *               lastName:
 *                 type: string
 *                 example: Agha
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               gender:
 *                 type: string
 *                 example: male
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "1998-05-20"
 *               address:
 *                 type: string
 *                 example: 12 Allen Avenue
 *               city:
 *                 type: string
 *                 example: Ikeja
 *               state:
 *                 type: string
 *                 example: Lagos
 *               country:
 *                 type: string
 *                 example: Nigeria
 *               image:
 *                 type: string
 *                 description: Profile image to upload
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   description: Updated user details
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid request data
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authAccess, handleUpload, userController.update);

/**
 * @swagger
 * /api/v1/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
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
 *                   - active
 *                   - pending
 *                   - suspended
 *                 example: active
 *     responses:
 *       200:
 *         description: User status updated successfully
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
 *                   example: User status updated successfully
 *                 data:
 *                   type: object
 *                   description: Updated user details
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - Authentication token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:id/status", authAccess, userController.updateStatus);

module.exports = router;
