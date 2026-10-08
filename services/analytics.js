const db = require("../models");

const getOverview = async (userId) => {
  const [stats] = await db.sequelize.query(
    `
  SELECT
    COUNT(id) AS "totalShipments",

    COUNT(id) FILTER (
      WHERE "status" = 'In Transit'
    ) AS "inTransit",

    COUNT(id) FILTER (
      WHERE "status" NOT IN ('Cancelled', 'Delivered', 'Returned')
    ) AS "activeShipments",

    COUNT(id) FILTER (
      WHERE "status" = 'Delivered'
      AND "updatedAt" >= DATE_TRUNC('month', CURRENT_DATE)
      AND "updatedAt" < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    ) AS "deliveredThisMonth"

  FROM "shipments" WHERE "customerId" = :userId;
  `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: { userId },
    },
  );

  const { totalShipments, activeShipments, inTransit, deliveredThisMonth } =
    stats;

  return {
    metrics: {
      totalShipments,
      activeShipments,
      inTransit,
      deliveredThisMonth,
    },
  };
};

const getAdminDashboardAnalytics = async () => {
  const [stats] = await db.sequelize.query(
    `
  SELECT
    COUNT(id) FILTER (
      WHERE "status" = 'In Transit'
    ) AS "inTransit",
     
    COUNT(id) FILTER (
      WHERE "status" IN ('Pending')
    ) AS "pendingShipments",

    COUNT(id) FILTER (
      WHERE "status" IN ('Confirmed')
    ) AS "confirmedShipments",
     
    COUNT(id) FILTER (
      WHERE "status"  IN ('Assigned')
    ) AS "assignedShipments",

    COUNT(id) FILTER (
      WHERE "status" IN ('Picked Up')
    ) AS "pickedUpShipments",

    COUNT(id) FILTER (
      WHERE "status" NOT IN ('Delivered')
    ) AS "deliveredShipments"

FROM shipments
  `,
    {
      type: db.sequelize.QueryTypes.SELECT,
    },
  );

  const {
    deliveredShipments,
    pickedUpShipments,
    assignedShipments,
    confirmedShipments,
    pendingShipments,
    inTransit,
    totalShipments,
  } = stats;

  return {
    deliveredShipments,
    pickedUpShipments,
    assignedShipments,
    confirmedShipments,
    pendingShipments,
    inTransit,
    totalShipments,
  };
};

const getDispatcherDashboardAnalytics = async (userId) => {
  const [stats] = await db.sequelize.query(
    `
  SELECT
    COUNT(id) FILTER (
      WHERE "status" = 'In Transit'
    ) AS "inTransit",
     
    COUNT(id) FILTER (
      WHERE "status" IN ('Pending')
    ) AS "pendingShipments",

    COUNT(id) FILTER (
      WHERE "status" IN ('Confirmed')
    ) AS "confirmedShipments",
     
    COUNT(id) FILTER (
      WHERE "status"  IN ('Assigned')
    ) AS "assignedShipments",

    COUNT(id) FILTER (
      WHERE "status" IN ('Picked Up')
    ) AS "pickedUpShipments",

    COUNT(id) FILTER (
      WHERE "status" NOT IN ('Delivered')
    ) AS "deliveredShipments"

FROM shipments WHERE "dispatcherId" = :userId
  `,
    {
      type: db.sequelize.QueryTypes.SELECT,
      replacements: {userId}
    },
  );

  const {
    deliveredShipments,
    pickedUpShipments,
    assignedShipments,
    confirmedShipments,
    pendingShipments,
    inTransit,
    totalShipments,
  } = stats;

  return {
    deliveredShipments,
    pickedUpShipments,
    assignedShipments,
    confirmedShipments,
    pendingShipments,
    inTransit,
    totalShipments,
  };
};

module.exports = { getOverview, getAdminDashboardAnalytics, getDispatcherDashboardAnalytics };
