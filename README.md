# Ecommerce API

A Node.js RESTful API for an ecommerce platform, built with Express and MongoDB. It supports authentication, user management, product management, and order processing.

## Features

- **Authentication**
  - Register (Signup)
  - Login (Signin)
  - Logout
- **Users**
  - Get all users (with pagination)
  - Get user by ID
  - Update user
  - Delete user
- **Products**
  - Get all products (with pagination)
  - Get product by ID
  - Create product
  - Update product
  - Delete product
- **Orders**
  - Get all orders by status (with pagination)
  - Get order by ID
  - Create order
  - Update order
  - Delete order

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or remote)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Ecommerce-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set environment variables in a `.env` file:

   ```env
   JWT_SECRET=your-super-secret-key-123
   EXPIRES_IN=7d
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   ```

   > By default, the app uses hardcoded values for JWT and connects to `mongodb://localhost:27017/ecommerce`.

4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The server will run at [http://localhost:8000](http://localhost:8000)

## API Endpoints

### Authentication

- `POST /api/register` — Register a new user
- `POST /api/login` — Login
- `POST /api/logout` — Logout (requires authentication)

### Users

- `GET /api/users` — Get all users
- `GET /api/users/:userId` — Get user by ID
- `PUT /api/update/:userId` — Update user
- `DELETE /api/delete/:userId` — Delete user

### Products

- `GET /api/products` — Get all products
- `GET /api/products/:productId` — Get product by ID
- `POST /api/products` — Create product (requires login)
- `PUT /api/products/:productId` — Update product (requires admin)
- `DELETE /api/products/:productId` — Delete product (requires admin)

### Orders

- `GET /api/orders` — Get all orders (requires login)
- `GET /api/order/:orderId` — Get order by ID (requires login)
- `POST /api/order/:productId` — Create order (requires login)
- `PUT /api/order/:orderId` — Update order (requires login)
- `DELETE /api/order/:orderId` — Delete order (requires login)

## Database Structure

### Users

- `id`
- `firstname` (string, required)
- `lastname` (string, required)
- `email` (string, required)
- `password` (string, required)
- `gender` (male or female, optional)
- `address` (string, optional)

### Products

- `id`
- `name` (string, required)
- `price` (number, required)
- `description` (string, optional)
- `image` (string, optional)

### Orders

- `id`
- `user` (reference to Users)
- `products[]` (reference to Products)
- `total` (number, required)
- `status` (string, required)

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- dotenv
- morgan
- errorhandler
- zod
- nodemon (dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Ahmed Bakr**

- Email: ahmedhamadabakr77@gmail.com
- GitHub: [@ahmedbakr](https://github.com/ahmedbakr)

---

⭐ If you like this project, don't forget to give it a star!
