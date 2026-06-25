# Garment Bundle Tracking System

> Production-oriented garment bundle tracking system built using React.js, React Native (Expo), Node.js, Express.js, and MongoDB.

---

## Tech Stack

### Frontend
- **React.js**
- **Vite**
- **JavaScript**
- **Tailwind CSS**

### Mobile
- **React Native**
- **Expo**
- **SQLite**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MongoDB Atlas**
- **Mongoose**

---

## Project Structure

```text
garment-bundle-tracking/
│
├── web/
├── server/
├── mobile/
├── docs/
└── README.md
```

---

## Setup & Installation

### Backend

Navigate to the backend folder.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start the backend server.

```bash
npm run dev
```

---

### Frontend

Navigate to the frontend folder.

```bash
cd web
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend.

```bash
npm run dev
```

---

### Mobile

Navigate to the mobile folder.

```bash
cd mobile
```

Install dependencies.

```bash
npm install
```

Start Expo.

```bash
npx expo start
```

---

## Documentation

Detailed architecture and design documents are available inside the `docs` folder.