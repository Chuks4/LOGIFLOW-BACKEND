"use strict";

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

module.exports = { ALLOWED_ACTIONS, ALLOWED_RESOURCES };
