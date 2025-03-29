const z = require("zod");
const orderSchema = z.object({
  user: z.string(),
  product: z.string(),
  quantity: z.number().int().positive(),
});

module.exports = { orderSchema };
