# Expense Management App

## Description
A simple Node.js application for managing user expenses with secure authentication.

## Setup

### Prerequisites
- Node.js
- MySQL

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/expenses-app.git
    cd expenses-app
    ```

2. Install dependencies:
    ```sh
    npm init -y

   npm install express mysql2 body-parser bcryptjs jsonwebtoken dotenv

    ```

3. Configure environment variables:
    Create a `.env` file in the root directory with the following content:
    ```env
    DB_HOST=localhost
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=expenses_app
    JWT_SECRET=your_jwt_secret
    ```

4. Set up the database:
    ```sql
    CREATE DATABASE expenses_app;
    USE expenses_app;
    CREATE TABLE Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    CREATE TABLE Expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );
    ```

5. Start the server:
    ```sh
    npm start
    ```

## API Endpoints

### Register a New User
- **Endpoint:** `POST /register`
- **Body:**
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```

### Login a User
- **Endpoint:** `POST /login`
- **Body:**
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```

### Add an Expense
- **Endpoint:** `POST /expenses`
- **Headers:**
    ```json
    {
        "Authorization": "Bearer your_jwt_token"
    }
    ```
- **Body:**
    ```json
    {
        "amount": 50.75,
        "date": "2024-07-23",
        "category": "Food"
    }
    ```

### View Expenses
- **Endpoint:** `GET /expenses`
- **Headers:**
    ```json
    {
        "Authorization": "Bearer your_jwt_token"
    }
    ```

## License
[MIT](https://choosealicense.com/licenses/mit/)
