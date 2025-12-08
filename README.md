# 🚗 Vehicles-management-server

A simple and efficient **Vehicle Rental System Backend** built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**.

🌐 **Live URL:** [https://vehicle-management-server.vercel.app](https://vehicle-management-server.vercel.app)  
💻 **GitHub Repo:** [https://github.com/RitaM5/Vehicles-management-server.git](https://github.com/RitaM5/Vehicles-management-server.git)

---

## 🚀 Features

- 👤 User authentication (Sign up, Sign in)
- 🚘 Vehicle management (Add, update, delete vehicles)
- 📅 Booking management (Create, cancel, return booking)
- 🔒 Role-based access (Customer, Admin)
- ⏱ Auto-return system (marks booking as returned after end date)
- 🛠 Error handling and validation
- 🌱 Environment variable configuration with **dotenv**

---

## 🧰 Technology Stack

| Category | Tools / Packages |
|-----------|------------------|
| **Backend Framework** | Express.js (v5) |
| **Language** | TypeScript |
| **Database** | PostgreSQL |
| **Authentication** | JSON Web Token (JWT) |
| **Password Hashing** | bcrypt |
| **Environment Config** | dotenv |
| **Database Client** | pg (node-postgres) |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash

# 1️⃣ Clone the repository
git clone https://github.com/RitaM5/Vehicles-management-server.git
cd express_server_one

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create .env file
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# 4️⃣ Run the server (Development Mode)
npm run dev
