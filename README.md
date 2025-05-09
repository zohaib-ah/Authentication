# Authenticator - MERN Stack Authentication System

A secure and modern authentication system built with the **MERN stack** that supports:

- User **sign-up** and **login**
- **Account verification** using **OTP** (One Time Password)
- **Password reset** via OTP
- **JWT**-based authentication for secure session handling
- **Logout** functionality

---

## Features

- 🔐 **User Registration**: Create a new account with email verification.
- 🔑 **Login/Logout**: Access secured areas with JWT tokens.
- 🛡️ **Account Verification**: Verify account via OTP sent through email.
- 🔄 **Password Reset**: Reset your password securely through OTP validation.
- 🔒 **Secure Sessions**: Authenticated routes protected by JWT middleware.
- ✨ **Responsive Frontend**: Built using React.js for a smooth user experience.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer (for sending OTPs)
- **Other Tools**: TailwindCSS (optional), Axios, bcrypt, dotenv

---

## Installation and Setup

### Backend Setup

```bash
git clone https://github.com/your-username/authenticator-backend.git
cd authenticator-backend
npm install
```

Create a `.env` file in the backend root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password
```

Run the server:

```bash
npm start
```

---
### Frontend Setup

```bash
git clone https://github.com/your-username/authenticator-frontend.git
cd authenticator-frontend
npm install
npm start
```

Ensure your frontend is configured to point to the backend API URL.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

