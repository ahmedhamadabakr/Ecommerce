const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true,
      trim: true, // إزالة المسافات الزائدة
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1000, // زيادة الحد الأقصى للوصف
      trim: true,
    },
    price: {
      type: Number, // تحويل السعر إلى رقم بدلاً من نص
      required: true,
      min: 0, // تجنب القيم السالبة
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // تجنب القيم السالبة
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    categoryImage: {
      photo_1: { type: String, default: null },
      photo_2: { type: String, default: null },
      photo_3: { type: String, default: null },
      photo_4: { type: String, default: null },
    },
  },
  { timestamps: true } // يضيف createdAt و updatedAt تلقائيًا
);

const Product = mongoose.model("Product", ProductsSchema);
module.exports = Product;
