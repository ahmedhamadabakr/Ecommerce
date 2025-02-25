const z = require('zod');

const objectIdSchema = z.object({
  id: z.string().min(24).max(24).regex(/^[0-9a-fA-F]{24}$/),  // 0123456789abcdef
});

module.exports = objectIdSchema;
