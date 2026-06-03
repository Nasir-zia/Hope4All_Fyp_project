# Hope4All 🤝

Hope4All is a modern, production-ready platform designed to streamline and verify donations for orphanages. The platform links donors, orphanage administrators, and moderators in a secure, transparent, and interactive environment. It incorporates real-time communications, secure document upload-based verification workflows, and status tracking.

---

## 🏗️ Project Architecture

The workspace is organized as a monorepo consisting of two primary components:

```
Hope4All/
├── Backend/                 # Express.js REST API & WebSocket server
│   ├── Config/              # Database connection configuration
│   ├── controllers/         # Route controller handlers (auth, donation, chat, etc.)
│   ├── middleware/          # JWT auth, Multer upload configuration
│   ├── model/               # MongoDB Mongoose schemas
│   ├── route/               # Express API endpoints
│   ├── socketHandler.js     # Real-time Chat socket server logic
│   └── index.js             # Server entry point
│
└── frontend/Hope4All/       # Mobile Frontend (React Native / Expo SDK 54)
    ├── app/                 # Expo Router file-based screens and tabs
    ├── components/          # Reusable UI components
    ├── constants/           # Styling constants and API configurations
    ├── contexts/            # React context providers
    ├── services/            # API call modules (REST & WebSockets)
    └── store/               # Zustand global state management
```

---

## ✨ Features

- **Multi-Role Authentication**: Customized dashboards and flows for **Donors**, **Orphanage Admins**, and **System Admins**.
- **Document-Based Verification**: Orphan registration utilizes secure uploads of B-Form and Parent Death Certificates to Cloudinary to ensure transparency and validity.
- **Donation Management**: Real-time listing, claiming, and status tracking (Pending → Approved → Received) of item-based donations.
- **Real-Time Messaging**: Built-in chat channel using Socket.io to allow direct communication between donors, admins, and orphanages.
- **Onboarding Notifications**: Automated welcome and transactional emails sent via the Resend API.
- **Optimized UI**: Seamless UX featuring modern gradients, clean transitions, Haptic feedback, and responsive lists.

---

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database)
- **Socket.io** (WebSockets)
- **Cloudinary** (Image hosting & uploads)
- **Resend SDK** (Email notifications)
- **Bcryptjs & JWT** (Authentication)

### Frontend
- **React Native & Expo (v54)**
- **Expo Router** (File-based navigation)
- **Zustand** (State management)
- **Socket.io-client** (Real-time sync)
- **React Native Reanimated** (UI Animations)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- npm or yarn
- Expo Go app on a mobile device (for local development testing) or an emulator (Android Studio / Xcode)

---

### 1. Setup the Backend

1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Duplicate `.env.example` and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your database credentials and API keys:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://...
     CLOUDINARY_CLOUD_NAME=...
     CLOUDINARY_API_KEY=...
     CLOUDINARY_API_SECRET=...
     JWT_SECRET=...
     RESEND_API_KEY=...
     EMAIL_USER=...
     ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 2. Setup the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend/Hope4All
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   - Duplicate `.env.example` and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Configure the API endpoints:
     ```env
     EXPO_PUBLIC_API_URL=http://<your-local-ip>:5000/api
     EXPO_PUBLIC_SOCKET_URL=http://<your-local-ip>:5000
     ```
     > [!TIP]
     > During local development, do not use `localhost` for physical mobile devices. Instead, specify your computer's local network IP address (e.g., `192.168.1.XX`).
4. Start the Expo development server:
   ```bash
   npx expo start
   ```
5. Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code on your phone using the Expo Go app.

---

## 🌐 Deployment

### Backend (Render / Railway / AWS)
This project is configured with a `render.yaml` template ready for one-click deployment on Render:
1. Link your GitHub repository to Render.
2. Render will automatically detect `render.yaml` and configure the service under Node.js runtime.
3. Make sure to define the following Environment Variables in your Render Dashboard settings (they should not be in your repository):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`

### Frontend (EAS Build / Web)
To bundle the React Native application for stores or deploy it as a web app:
- Build binary files using Expo Application Services (EAS):
  ```bash
  eas build --platform all
  ```
- Build web bundles:
  ```bash
  npx expo export --platform web
  ```

---

## 🔒 Security & Git Policies

Please follow these guidelines to prevent credential leaks:
1. **Never commit `.env` files**: All local environment configurations are ignored by Git under `.gitignore`.
2. **Use `.env.example` files**: When adding new configurations or environment dependencies, update the relevant `.env.example` template files with descriptive placeholder keys.
3. **Ignore testing scripts**: Do not commit local scratchpad scripts (`Backend/scratch/`) containing hardcoded credentials.
