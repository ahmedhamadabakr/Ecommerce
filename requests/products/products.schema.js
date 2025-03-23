const z = require("zod");
const productsSchema = z.object({
  title: z.string().min(3).max(255).nonempty(),
  content: z.string().min(3).max(255).nonempty(),
  image: z.string().nonempty(),
  category: z.string().nonempty(),
});

module.exports = { productsSchema };
