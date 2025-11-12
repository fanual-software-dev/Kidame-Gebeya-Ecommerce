🛒 E-commerce Platform Backend (Express + TypeScript + Prisma + Supabase)

A scalable and cleanly architected backend API for an E-commerce Platform, built with Express.js, TypeScript, and Prisma ORM connected to Supabase (PostgreSQL).
Implements JWT authentication, role-based authorization, Zod validation, transactions, and RESTful endpoints for managing users, products, and orders.

-----------------------------------------------------------------------

🚀 Features


🧑‍💻 Authentication

Register and login with strong password policies

Secure password hashing with bcrypt

JWT-based authentication

Role-based access (USER / ADMIN)

👥 User Management

GET /users/me – Get current user profile

GET /users – List all users (Admin only)

GET /users/:id – Fetch specific user (Admin only)

DELETE /users/:id – Delete a user (Admin only)

🛍️ Product Management

POST /products – Create a product (Admin only)

PUT /products/:id – Update product (Admin only)

DELETE /products/:id – Delete product (Admin only)

GET /products – Paginated + searchable product listing (Public)

GET /products/:id – Product details (Public)

🧾 Orders

POST /orders – Place new order (User only)

Validates stock

Calculates total price

Uses Prisma transactions for atomic updates

GET /orders – View logged-in user's order history

--------------------------------------------------------------

⚙️ Setup Instructions

1️⃣ Clone the repository

```
git clone https://github.com/<your-username>/ecommerce-backend.git
cd ecommerce-backend`
```

2️⃣ Install dependencies

```
pnpm install

```

3️⃣ Configure environment variables

```
PORT=5000
JWT_SECRET=supersecretkey
DATABASE_URL="postgresql://postgres:<your_password>@db.<your-supabase>.supabase.co:5432/postgres?sslmode=require"
```

4️⃣ Run Prisma migrations

```
pnpm prisma migrate dev --name init

```
Generate Prisma client:

```
pnpm prisma generate

```

5️⃣ Start the development server

```
pnpm run dev

```

-------------------------------------------------------------

🔒 Security Highlights

Passwords are hashed using bcrypt

JWT tokens signed with secret key

Role-based access control for Admin endpoints

Input validation with Zod for every request

Safe database operations via Prisma transactions

💡 Future Enhancements

Product image uploads (Cloudinary or S3)

Caching (Redis) for product listings

Rate limiting with express-rate-limit

Order status updates (Admin panel)

API documentation via Swagger

------------------------------------------------------------------------

👨‍💻 Author

Fanual Asfaw
- Full Stack / Blockchain Developer
- Built with ❤️ using TypeScript, Express, Supabase(Posgres) and Prisma.
