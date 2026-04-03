
```markdown
Finance Data Processing & Access Control Backend

A secure, scalable backend system built with **Node.js**, **Express**, and **PostgreSQL** to manage financial records. This project implements strict **Role-Based Access Control (RBAC)**, data validation using **Zod**, and automated database synchronization via **Sequelize ORM**.

---

Key Features

* **User Management:** Register and login with secure password hashing (BcryptJS).
* **Role-Based Access Control (RBAC):**
    * `Viewer`: Read-only access to their own records.
    * `Analyst`: Can create, view, and update records + access dashboard analytics.
    * `Admin`: Full CRUD capabilities + user management + global data access.
* **Financial Records:** Manage transactions with fields for amount, type (Income/Expense), category, and date.
* **Dashboard Analytics:** Aggregated data endpoints for Net Balance, Category-wise totals, and Recent Activity.
* **Data Integrity:** Strict schema validation using **Zod** and relational constraints in PostgreSQL.
* **Error Handling:** Centralized middleware for consistent, helpful API error responses.

---

## 📂 Project Structure

```text
finance-backend/
├── config/             # Database connection (Sequelize & Supabase)
├── controllers/        # Business logic (Auth, Records, Dashboard)
├── middleware/         # JWT Auth guards, Role checks, Error handling
├── models/             # Sequelize models (User.js, Record.js)
├── routes/             # API Route definitions
├── utils/              # Helper functions (JWT generation)
├── validations/        # Zod validation schemas
├── app.js              # Express app configuration & middleware
└── server.js           # Server entry point & DB synchronization
```

---

Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted via Supabase)
* **ORM:** Sequelize
* **Validation:** Zod
* **Security:** JSON Web Tokens (JWT), BcryptJS, CORS

---

## ⚙️ Setup & Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-link>
    cd finance-backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    DATABASE_URL=postgres://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```

4.  **Run the Application:**
    The system will automatically sync models and create tables in your Supabase database on the first run.
    ```bash
    npm start
    ```

---

 API Documentation

### 1. Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user | Public |
| `POST` | `/api/v1/auth/login` | Login and get JWT token | Public |
| `PATCH`| `/api/v1/auth/manage-user/:id` | Update user role or status | Admin |

### 2. Financial Records
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/records` | List records (supports filters) | All Roles |
| `POST` | `/api/v1/records` | Create a new financial record | Admin, Analyst |
| `PATCH`| `/api/v1/records/:id` | Update an existing record | Admin, Analyst |
| `DELETE`| `/api/v1/records/:id` | Delete a record | Admin |

### 3. Dashboard & Analytics
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/summary` | Balance, Income/Expense, Categories | Admin, Analyst |

---

## 🛡️ Security & Validation Logic

* **Zod Schema Validation:** Every request is validated before hitting the database. For example, amounts must be positive numbers and types must be 'Income' or 'Expense'.
* **Ownership Protection:** Users (except Admins) are restricted from accessing or modifying records they did not create.
* **Active Status Check:** If an Admin sets a user's status to `Inactive`, their JWT token is immediately rejected by the middleware.

---

## 📝 Design Assumptions
* **Data Isolation:** I assumed that Analysts and Viewers should only see their own data for privacy, while Admins require a "God-eye" view of all financial transactions.
* **Database Sync:** Used `sequelize.sync({ alter: true })` to ensure that any model changes in code are reflected in the Supabase schema automatically without manual migration files.

---
