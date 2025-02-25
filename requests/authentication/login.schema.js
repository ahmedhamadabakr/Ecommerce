const z = require('zod');

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

module.exports = loginSchema;
