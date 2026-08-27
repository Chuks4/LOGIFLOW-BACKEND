const router = require("express").Router();
const rolesController = require("../controllers/roles");
const {authAccess} = require("../middlewares/authAccess");
const { validateRole } = require("../validators/rbac");
const rolePermsController = require("../controllers/role_permission");
const { hasAccessTo } = require("../middlewares/authorize");

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Create a new role
 *     description: Create a new role with the specified name
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: admin
 *               desc:
 *                 type: string
 *                 description: The role description
 *                 example: Admin role
 *     responses:
 *       201:
 *         description: Role created successfully
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
router.post(
  "/",
  authAccess,
  validateRole,
  // hasAccessTo("role", "create"),
  rolesController.create,
);

/**
 * @swagger
 * /api/v1/roles:
 *   get:
 *     summary: Get all roles
 *     description: Get all roles
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         description: The keyword to search for
 *         required: false
 *         schema:
 *           type: string
 *           example: admin
 *
 *       - in: query
 *         name: status
 *         description: Filter by role status (true:active, false:inactive)
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
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
 *         description: Roles retrieved successfully
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
router.get("/", authAccess, rolesController.getAll);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Get a role by ID
 *     tags:
 *       - Roles
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
router.get("/:id", authAccess, rolesController.getById);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Update a role by ID
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: super_admin
 *                 example: admin
 *               desc:
 *                 type: string
 *                 description: The role description
 *                 example: Admin role
 *               isActive:
 *                 type: boolean
 *                 description: The role status (true:active, false:inactive)
 *                 example: true
 *     responses:
 *       200:
 *         description: Role updated successfully
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
router.put("/:id", authAccess, rolesController.update);

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags:
 *       - Roles
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
 *         description: Role deleted successfully
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
router.delete("/:id", authAccess, rolesController.remove);

/**
 * @swagger
 * /api/v1/roles/{id}/assign-permissions:
 *   post:
 *     summary: Assign permissions to a role
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: The list of permission IDs to assign to the role
 *                 example:
 *                   - "07c1a5ae-9fd7-52c7-2223-68e350e71fc3"
 *                   - "07c1a5ae-9fd7-52c7-2223-68e350e71fc4"
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role or permission not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:id/assign-permissions",
  authAccess,
  rolePermsController.assignPermissions,
);

/**
 * @swagger
 * /api/v1/roles/{id}/remove-permissions:
 *   delete:
 *     summary: Remove permissions from a role
 *     tags:
 *       - Roles
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: The list of permission IDs to remove to the role
 *                 example:
 *                   - "07c1a5ae-9fd7-52c7-2223-68e350e71fc3"
 *                   - "07c1a5ae-9fd7-52c7-2223-68e350e71fc4"
 *     responses:
 *       200:
 *         description: Permissions removed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role or permission not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id/remove-permissions",
  authAccess,
  rolePermsController.removePermissions,
);

module.exports = router;
