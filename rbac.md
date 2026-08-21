# LogiFlow RBAC System

A secure and scalable **Role-Based Access Control (RBAC)** system built with **Node.js, Express.js, PostgreSQL, and Sequelize**.

The system provides centralized authentication and authorization by allowing administrators to manage:

* Users
* Roles
* Permissions
* Resource access
* Actions
* Role-permission assignments

The RBAC system is designed as part of the **LogiFlow logistics management platform**, but its architecture can also be adapted for other applications requiring fine-grained access control.

---

# Table of Contents

* [Overview](#overview)
* [RBAC Architecture](#rbac-architecture)
* [Core Concepts](#core-concepts)

  * [User](#user)
  * [Role](#role)
  * [Permission](#permission)
  * [Resource](#resource)
  * [Action](#action)
* [Resource and Action Model](#resource-and-action-model)
* [Allowed Resources](#allowed-resources)
* [Allowed Actions](#allowed-actions)
* [Permission Structure](#permission-structure)
* [Permission Examples](#permission-examples)
* [Role and Permission Examples](#role-and-permission-examples)
* [Database Relationships](#database-relationships)
* [Authentication](#authentication)
* [Authorization Flow](#authorization-flow)
* [API Endpoints](#api-endpoints)
* [Security](#security)
* [Installation](#installation)
* [API Documentation](#api-documentation)
* [Future Improvements](#future-improvements)
* [License](#license)

---

# Overview

Role-Based Access Control allows the application to determine what a user is allowed to do based on the **role assigned to that user**.

Instead of assigning permissions directly to individual users, permissions are grouped into roles.

The basic relationship is:

```text
User
  │
  │ belongs to
  ▼
Role
  │
  │ has many
  ▼
Permissions
  │
  ├── Resource
  └── Action
```

For example:

```text
User
 └── Dispatcher
      ├── shipments:read
      ├── shipments:update
      ├── shipments:assign
      ├── drivers:read
      └── drivers:assign
```

The dispatcher does not receive these permissions individually. They inherit them from the `Dispatcher` role.

---

# RBAC Architecture

The system consists of four primary concepts:

```text
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ belongs to
     ▼
┌──────────┐
│   Role   │
└────┬─────┘
     │
     │ has
     ▼
┌──────────────┐
│  Permission  │
└──────┬───────┘
       │
       ├──────────────┐
       ▼              ▼
   Resource         Action
```

A permission combines a resource and an action:

```text
Resource + Action = Permission
```

For example:

```text
shipments + update = shipments:update
```

---

# Core Concepts

## User

A user represents an individual account in the system.

A user belongs to a role through `roleId`.

Example:

```json
{
  "id": "826895ba-1782-4cfc-965d-12245463a382",
  "email": "user@example.com",
  "roleId": "06360c5d-c035-4980-a7c9-06d6a0a801b5",
  "userType": "customer"
}
```

The user does not directly contain a list of permissions.

Instead:

```text
User
  ↓
Role
  ↓
Permissions
```

This makes permission management easier because changing a role's permissions automatically affects all users assigned to that role.

---

## Role

A role represents a collection of permissions.

Examples include:

```text
Admin
Dispatcher
Driver
Customer
```

For example:

```text
Dispatcher
├── shipments:create
├── shipments:read
├── shipments:update
├── shipments:assign
├── drivers:read
└── drivers:assign
```

Every user assigned to the Dispatcher role inherits these permissions.

---

## Permission

A permission defines a specific operation that a user is allowed to perform.

Permissions consist of:

```text
Resource + Action
```

Examples:

```text
user:create
user:read
user:update
user:delete

shipments:create
shipments:read
shipments:update
shipments:assign

payments:read
payments:approve
payments:reject
```

---

# Resource and Action Model

## Resource

A **resource** represents an entity or functional area within the application that requires access control.

Examples:

```text
user
role
permission
shipments
drivers
vehicles
payments
reports
```

If a permission is:

```text
shipments:update
```

then:

```text
shipments
```

is the resource.

It tells the authorization system:

> The user wants to perform an operation on shipments.

---

## Action

An **action** represents what the user is allowed to do with a resource.

For example:

```text
shipments:create
```

means:

> The user can create shipments.

While:

```text
shipments:update
```

means:

> The user can update shipments.

---

# Allowed Resources

Resources are centrally defined using `ALLOWED_RESOURCES`.

```js
const ALLOWED_RESOURCES = Object.freeze({
  user: "user",
  role: "role",
  permission: "permission",
  shipments: "shipments",
  vehicles: "vehicles",
  drivers: "drivers",
  orders: "orders",
  invoices: "invoices",
  payments: "payments",
  reports: "reports",
  settings: "settings",
  dashboard: "dashboard",
  profile: "profile",
  notifications: "notifications",
  messages: "messages",
});
```

### Resource Reference

| Resource        | Description                                 |
| --------------- | ------------------------------------------- |
| `user`          | User accounts and user management           |
| `role`          | Roles and role management                   |
| `permission`    | Permission management                       |
| `shipments`     | Shipment creation, tracking, and management |
| `vehicles`      | Vehicle management                          |
| `drivers`       | Driver management                           |
| `orders`        | Order management                            |
| `invoices`      | Invoice management                          |
| `payments`      | Payment management                          |
| `reports`       | Reports and analytics                       |
| `settings`      | Application/system settings                 |
| `dashboard`     | Dashboard information and statistics        |
| `profile`       | User profile management                     |
| `notifications` | Notifications                               |
| `messages`      | User/system messages                        |

Centralizing resources prevents inconsistent permission names.

For example, instead of allowing:

```text
shipment
shipments
Shipment
SHIPMENTS
```

the application defines the accepted resource:

```text
shipments
```

---

# Allowed Actions

Actions are centrally defined using `ALLOWED_ACTIONS`.

```js
const ALLOWED_ACTIONS = Object.freeze({
  create: "create",
  read: "read",
  update: "update",
  delete: "delete",
  assign: "assign",
  unassign: "unassign",
  manage: "manage",
  approve: "approve",
  reject: "reject",
});
```

### Action Reference

| Action     | Description                                        |
| ---------- | -------------------------------------------------- |
| `create`   | Create a new resource                              |
| `read`     | View or retrieve a resource                        |
| `update`   | Modify an existing resource                        |
| `delete`   | Delete a resource                                  |
| `assign`   | Assign a resource/responsibility to another entity |
| `unassign` | Remove an existing assignment                      |
| `manage`   | Perform broad management operations                |
| `approve`  | Approve a request, transaction, or operation       |
| `reject`   | Reject a request, transaction, or operation        |

---

# Permission Structure

A permission follows this structure:

```text
resource:action
```

For example:

```text
user:create
```

can be interpreted as:

```text
Resource = user
Action   = create
```

Therefore:

```text
user + create
      ↓
user:create
```

Another example:

```text
drivers:assign
```

means:

```text
Resource = drivers
Action   = assign
```

---

# Permission Validation

Only resources and actions defined in the allowed lists should be accepted.

### Valid permission

```json
{
  "resource": "shipments",
  "action": "update",
  "desc": "Update shipment information"
}
```

### Invalid action

```json
{
  "resource": "shipments",
  "action": "fly",
  "desc": "Fly a shipment"
}
```

`fly` is not an allowed action.

### Invalid resource

```json
{
  "resource": "customers",
  "action": "read",
  "desc": "Read customers"
}
```

If `customers` is not defined in `ALLOWED_RESOURCES`, the permission should be rejected.

---

# Permission Examples

## User Management

```text
user:create
user:read
user:update
user:delete
```

## Role Management

```text
role:create
role:read
role:update
role:delete
```

## Permission Management

```text
permission:create
permission:read
permission:update
permission:delete
```

## Shipment Management

```text
shipments:create
shipments:read
shipments:update
shipments:delete
shipments:assign
shipments:unassign
```

## Driver Management

```text
drivers:create
drivers:read
drivers:update
drivers:delete
drivers:assign
drivers:unassign
```

## Payment Management

```text
payments:read
payments:approve
payments:reject
```

## Reports

```text
reports:read
```

---

# Role and Permission Examples

## Admin

An administrator can have broad access:

```text
Admin
│
├── user:create
├── user:read
├── user:update
├── user:delete
│
├── role:create
├── role:read
├── role:update
├── role:delete
│
├── permission:create
├── permission:read
├── permission:update
└── permission:delete
```

---

## Dispatcher

```text
Dispatcher
│
├── shipments:create
├── shipments:read
├── shipments:update
├── shipments:assign
├── shipments:unassign
├── drivers:read
└── drivers:assign
```

---

## Driver

```text
Driver
│
├── shipments:read
├── shipments:update
└── profile:update
```

---

## Customer

```text
Customer
│
├── shipments:create
└── shipments:read
```

---

# Database Relationships

The database follows these relationships:

```text
Role 1 ─────────── * User

Role * ─────────── * Permission
          │
          ▼
   RolePermission
```

### User → Role

A user belongs to one role:

```text
User.roleId → Role.id
```

### Role → User

A role can have many users:

```text
Role.hasMany(User)
```

### Role ↔ Permission

A role can have multiple permissions, and a permission can belong to multiple roles.

This is implemented through a join table:

```text
Role
  │
  ├── RolePermission
  │       │
  │       └── Permission
  │
  └── RolePermission
```

---

# Role Deletion Behavior

Roles should not cascade-delete users.

For example:

```text
Admin Role
   │
   ├── User A
   ├── User B
   └── User C
```

Deleting the Admin role should **not** delete User A, B, or C.

The preferred behavior is either:

### Restrict deletion

Prevent the role from being deleted while users are assigned to it.

```text
Delete Role
    ↓
Users still assigned?
    ↓
Yes
    ↓
Reject deletion
```

Or:

### Set role to NULL

If the application's business rules allow users without a role:

```text
Delete Role
    ↓
User remains
    ↓
User.roleId = NULL
```

---

# Authentication

The RBAC system uses JWT authentication.

The authentication system uses:

* Access tokens
* Refresh tokens
* HttpOnly cookies
* JWT secrets stored in environment variables

The general authentication flow is:

```text
Login
  │
  ├───────────────┐
  ▼               ▼
Access Token   Refresh Token
  │               │
  ▼               ▼
API Requests   HttpOnly Cookie
```

---

## Access Token

The access token is used to authenticate API requests:

```http
Authorization: Bearer <access_token>
```

The access token is short-lived.

---

## Refresh Token

The refresh token is stored in an HttpOnly cookie:

```text
refresh_token
```

Because it is HttpOnly, JavaScript running in the browser cannot access it through:

```js
document.cookie
```

When the access token expires, the frontend calls:

```http
POST Refresh token route.
```

The browser automatically attaches the refresh cookie to the request.

The backend then:

1. Reads the refresh token.
2. Verifies the JWT.
3. Validates the refresh-token record/JTI if applicable.
4. Generates a new access token.
5. Rotates the refresh token.
6. Returns the new access token.

---

# Authorization Flow

Authentication and authorization are separate processes.

### Authentication

Determines:

> Who is the user?

### Authorization

Determines:

> What is this user allowed to do?

The authorization flow is:

```text
Request
   │
   ▼
JWT Authentication
   │
   ▼
Identify User
   │
   ▼
Get User Role
   │
   ▼
Get Role Permissions
   │
   ▼
Check Required Permission
   │
   ├───────────────┐
   ▼               ▼
Allowed          Denied
   │               │
   ▼               ▼
Continue       403 Forbidden
```

For example, an endpoint may require:

```text
shipments:update
```

The middleware checks whether the authenticated user's role has this permission.

---

# API Endpoints

## Permissions

### Create Permission

```http
POST /api/v1/permissions
```

Example:

```json
{
  "resource": "user",
  "action": "create",
  "desc": "Create a new user"
}
```

### Update Permission

```http
PUT /api/v1/permissions/{id}
```

Example:

```json
{
  "resource": "user",
  "action": "update",
  "desc": "Update an existing user"
}
```

### Delete Permission

```http
DELETE /api/v1/permissions/{id}
```

### Get Permissions by Role

```http
GET /api/v1/permissions/role/{roleId}
```

Returns all permissions assigned to a specific role.

---

# Roles

### Create Role

```http
POST /api/v1/roles
```

Example:

```json
{
  "name": "Dispatcher",
  "description": "Manages shipments and driver assignments"
}
```

### Update Role

```http
PUT /api/v1/roles/{id}
```

### Delete Role

```http
DELETE /api/v1/roles/{id}
```

---

# Assign Permissions to a Role

```http
POST /api/v1/roles/{id}/assign-permissions
```

Example:

```json
{
  "permissionIds": [
    "07c1a5ae-9fd7-52c7-2223-68e350e71fc3",
    "07c1a5ae-9fd7-52c7-2223-68e350e71fc4"
  ]
}
```

The endpoint associates the specified permissions with the role.

---

# HTTP Authorization Responses

## 401 Unauthorized

Returned when the request is not properly authenticated.

Example:

```json
{
  "status": false,
  "message": "No token provided"
}
```

or:

```json
{
  "status": false,
  "message": "Invalid or expired token"
}
```

---

## 403 Forbidden

Returned when the user is authenticated but does not have the required permission.

Example:

```json
{
  "status": false,
  "message": "You do not have permission to perform this action"
}
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd LogiFlow
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Run migrations:

```bash
npx sequelize-cli db:migrate
```

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8000
```

---

# API Documentation

Swagger API documentation is available at:

```text
http://localhost:8000/api-docs
```

Swagger can be used to:

* Authenticate requests
* Create roles
* Create permissions
* Assign permissions to roles
* Retrieve role permissions
* Test protected endpoints
* Test authorization behavior

---

# Security

The system implements several security practices:

* Passwords are hashed before storage.
* Access tokens are short-lived.
* Refresh tokens are stored in HttpOnly cookies.
* JWT secrets are stored in environment variables.
* Protected endpoints require authentication.
* Authorization is handled separately from authentication.
* Permissions are assigned through roles rather than directly to users.
* UUIDs are used for entity identifiers.
* Sensitive environment variables are excluded from source control.
* Resource and action values are validated against predefined allowed values.

---

# Future Improvements

Potential improvements include:

* Redis-based permission caching
* Permission cache invalidation
* Role hierarchies
* Fine-grained resource-level authorization
* Audit logging for authorization events
* Rate limiting
* Admin dashboard for role and permission management
* Dynamic authorization policies

---

# License

This project is intended for educational and development purposes.

Add your preferred license here, for example:

```text
MIT License
```

---

# Author

**Chukwuemeka Agha**

Backend Developer
Node.js | Express.js | PostgreSQL | Sequelize

Built as part of the **LogiFlow logistics management system**.
