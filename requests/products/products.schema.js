const z = require("zod");
const productsSchema = z.object({
  title: z.string().min(3).max(255).nonempty(),
  description: z.string().min(3).max(255).nonempty(),
  category: z.string().nonempty(),
  price: z.number(),
  categoryImage: z.object({
    photo_1: z.string().url().optional(),
    photo_2: z.string().url().optional(),
    photo_3: z.string().url().optional(),
    photo_4: z.string().url().optional(),
  }),
  quantity: z.number(),
});

module.exports = productsSchema;
