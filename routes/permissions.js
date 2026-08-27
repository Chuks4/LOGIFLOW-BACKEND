const router = require("express").Router();
const {authAccess} = require("../middlewares/authAccess");
const permsController = require("../controllers/permissions");
const { validatePermission } = require("../validators/rbac");

/**
 * @swagger
 * /api/v1/permissions:
 *   post:
 *     summary: Create a permission
 *     description: Create a new permission with a resource, action, and description.
 *     tags:
 *       - Permissions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource
 *               - action
 *             properties:
 *               resource:
 *                 type: string
 *                 description: The resource the permission applies to.
 *                 example: user
 *               action:
 *                 type: string
 *                 description: The action allowed on the resource.
 *                 example: create
 *               desc:
 *                 type: string
 *                 description: A description of the permission.
 *                 example: Create a new user
 *     responses:
 *       '201':
 *         description: Permission created successfully
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
 *                       example: 826895ba-1782-4cfc-965d-12245463a382
 *                     name:
 *                       type: string
 *                       example: user.create
 *                     resource:
 *                       type: string
 *                       example: user
 *                     action:
 *                       type: string
 *                       example: create
 *                     desc:
 *                       type: string
 *                       example: Can create a new user
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '409':
 *         description: Permission already exists
 *       '500':
 *         description: Internal server error
 */
router.post("/", validatePermission, authAccess, permsController.create);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   put:
 *     summary: Update a permission
 *     description: Update an existing permission by its ID.
 *     tags:
 *       - Permissions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the permission to update.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 826895ba-1782-4cfc-965d-12245463a382
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource
 *               - action
 *             properties:
 *               resource:
 *                 type: string
 *                 description: The resource the permission applies to.
 *                 example: user
 *               action:
 *                 type: string
 *                 description: The action allowed on the resource.
 *                 example: update
 *               desc:
 *                 type: string
 *                 description: A description of the permission.
 *                 example: Update an existing user
 *     responses:
 *       '200':
 *         description: Permission updated successfully
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
 *                       example: 826895ba-1782-4cfc-965d-12245463a382
 *                     name:
 *                       type: string
 *                       example: user.update
 *                     resource:
 *                       type: string
 *                       example: user
 *                     action:
 *                       type: string
 *                       example: update
 *                     desc:
 *                       type: string
 *                       example: Update an existing user
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Permission not found
 *       '409':
 *         description: Permission already exists
 *       '500':
 *         description: Internal server error
 */
router.put("/:id", authAccess, permsController.update);

/**
 * @swagger
 * /api/v1/permissions/{id}:
 *   delete:
 *     summary: Delete a permission
 *     description: Delete an existing permission by its ID.
 *     tags:
 *       - Permissions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the permission to delete.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 826895ba-1782-4cfc-965d-12245463a382
 *     responses:
 *       '200':
 *         description: Permission deleted successfully
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
 *                   example: 826895ba-1782-4cfc-965d-12245463a382
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Permission not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", authAccess, permsController.remove);

/**
 * @swagger
 * /api/v1/permissions/role/{roleId}:
 *   get:
 *     summary: Get all permissions assigned to a role
 *     description: Retrieve all permissions assigned to a specific role by its ID.
 *     tags:
 *       - Permissions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         description: The ID of the role.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 826895ba-1782-4cfc-965d-12245463a382
 *     responses:
 *       '200':
 *         description: Permissions retrieved successfully
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
 *                     type: string
 *                     example: user.create
 *       '400':
 *         description: Invalid role ID
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal server error
 */
router.get("/role/:roleId", authAccess, permsController.geAllByRoleId);

module.exports = router;
