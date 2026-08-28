const db = require("../models");
const { secret_key } = require("../config/payment.config");
const crypto = require("crypto");
const { trimData } = require("../utils/util");

const verifySignature = (body, signature) => {
  const rawBody = normalizePayload(body);
  const hash = crypto
    .createHmac("sha512", secret_key)
    .update(rawBody)
    .digest("hex");

  if (hash !== String(signature).trim()) {
    return { status: false, message: "Invalid signature", rawBody: null };
  }

  return { status: true, message: "Signature verified", rawBody };
};

const normalizePayload = (body) => {
  if (body === null || body === undefined) {
    return "";
  }

  if (Buffer.isBuffer(body)) {
    return body.toString("utf-8");
  }

  if (typeof body === "string") {
    return body;
  }

  return JSON.stringify(body);
};

const createWebhookEvent = async (data) => {
  const { body, signature, reference, eventType } = trimData(data);
  const rawBody = normalizePayload(body);
  const parsedBody = JSON.parse(rawBody);

  const [newObject, created] = await db.webhookEvents.findOrCreate({
    where: { reference, eventType },
    defaults: {
      body,
      signature,
      eventType,
      reference,
    },
  });

  return { created, newObject, parsedBody };
};

module.exports = {
  verifySignature,
  createWebhookEvent,
};
