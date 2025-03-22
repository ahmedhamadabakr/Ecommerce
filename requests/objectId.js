const { z } = require("zod");

const objectIdschema = z.object({
  userId: z.string().min(24).max(24).regex(/^[0-9a-fA-F]{24}$/),
});

module.exports = objectIdschema;