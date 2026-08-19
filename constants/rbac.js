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

module.exports = { ALLOWED_ACTIONS };
