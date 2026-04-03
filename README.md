Here is the clean, professional version of your **README.md** without emojis. You can copy and paste this directly into your project.

-----

# Finance Dashboard Backend

### Objective

This project is a backend API for a Finance Dashboard system that supports role-based access control (RBAC), financial data management, and analytical insights. It demonstrates a modular backend architecture, strict data validation, and automated database synchronization using Sequelize with PostgreSQL.

-----

### Features

#### 1\. User Authentication and Roles

  * **Secure Auth:** Register and login using JWT (JSON Web Tokens).
  * **Password Security:** Multi-round hashing using bcryptjs.
  * **RBAC (Role-Based Access Control):**
      * **Viewer:** Can view their own transactions and dashboard summary.
      * **Analyst:** Can create, update, and view transactions.
      * **Admin:** Full access (CRUD on all records, user status management, and category control).

#### 2\. Financial Records Management

  * **Full CRUD:** Create, read, update, and delete financial entries.
  * **Smart Filtering:** Supports filtering by type (Income/Expense), category, and date range.
  * **Ownership Security:** Users only see their own records (Admins see everything).

#### 3\. Dashboard Analytics

  * **Summary Totals:** Real-time calculation of Total Income, Total Expenses, and Net Balance.
  * **Categorization:** Aggregated totals grouped by category (e.g., Food, Rent, Salary).
  * **Recent Activity:** Quick-access list of the 5 most recent transactions.

-----

### Project Structure

```text
backend/
├── config/             # Sequelize and Supabase connection setup
├── controllers/        # Business logic (Auth, Records, Dashboard)
├── middleware/         # JWT Auth, Role-checks, and Global Error Handler
├── models/             # Sequelize models (User.js, Record.js)
├── routes/             # API Route definitions (Express Router)
├── utils/              # Helper functions (Token generation)
├── validations/        # Zod validation schemas
├── app.js              # Express app setup and middleware integration
└── server.js           # Entry point (Server start and DB sync)
```

-----

### Tech Stack

  * **Runtime:** Node.js (ES Modules)
  * **Framework:** Express.js
  * **Database:** PostgreSQL (Hosted on Supabase)
  * **ORM:** Sequelize
  * **Validation:** Zod
  * **Security:** JWT, BcryptJS, CORS

-----

### Setup and Installation

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/Chandu5342/FinancialBE.git
    cd backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:

    ```env
    PORT=5000
    DATABASE_URL=postgres://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **Run Locally:**

    ```bash
    npm run dev
    ```

    *Note: Sequelize will automatically sync and create the tables in your Supabase database.*

-----

### API Endpoints

#### Authentication

| Method | Endpoint | Description | Body / Params | Access |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/v1/auth/register | Create a new user | {name, email, password, role} | Public |
| POST | /api/v1/auth/login | Login and get Token | {email, password} | Public |
| PATCH | /api/v1/auth/manage-user/:id | Update status/role | {status, role} | Admin |

#### Financial Records

| Method | Endpoint | Description | Query Params | Access |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/records | List all records | type, category, date range | All Roles |
| POST | /api/v1/records | Create record | {amount, type, category, date} | Admin, Analyst |
| PATCH | /api/v1/records/:id | Update record | {amount, category, etc} | Admin, Analyst |
| DELETE | /api/v1/records/:id | Delete record | id | Admin |

#### Dashboard and Analytics

| Method | Endpoint | Description | Data Returned | Access |
| :--- | :--- | :--- | :--- | :--- |
| GET | /api/v1/dashboard/summary | Dashboard stats | Totals, Balance, Categories | Admin, Analyst |

-----

### Validation and Database Design

#### Data Validation (Zod)

Every request is intercepted by a validation layer. If an incorrect data type is sent (e.g., a negative amount or an invalid email), the API returns a structured 400 Bad Request error before reaching the database.

#### Entity Relationships

  * **One User to Many Records:** Each transaction is linked to a userId.
  * **Data Privacy:** A Viewer can only query records where userId matches their own token ID.

-----

### API Testing (Postman)

#### 1\. Authentication (Register and Login)  
       
   <img width="1897" height="1068" alt="image" src="https://github.com/user-attachments/assets/35d405a2-1489-4fcb-9f5a-44fb71aecf59" />

   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3bdc32ff-f5c3-41b7-b0f4-c68ea50b544b" />



#### 2\. Dashboard Summary API
   <img width="1920" height="1077" alt="image" src="https://github.com/user-attachments/assets/19983aed-9d93-4f6b-aadc-ed537c317a7b" />


#### 3\. Access Control (RBAC) Testing
   <img width="1920" height="1079" alt="image" src="https://github.com/user-attachments/assets/ccd96898-c5f2-499b-b61a-563b1b35252a" />
   <img width="1917" height="1075" alt="image" src="https://github.com/user-attachments/assets/4ce26884-7b48-44d6-b00f-e042638daca9" />



-----

### Assumptions

1.  Users (except Admins) manage only their own financial data.
2.  The database schema is synchronized automatically via Sequelize sync({ alter: true }).
3.  Authentication is strictly handled via the Authorization: Bearer header.
