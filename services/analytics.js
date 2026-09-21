const { Op } = require("sequelize");
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

module.exports = { getOverview };
