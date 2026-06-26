# Custom Gift Order Fulfillment & Design Status Tracker

A Full Stack React + Node.js application for tracking custom gift orders.

## Features
- **Dashboard:** Analytics and charts using Recharts.
- **Order Management:** View, create, and filter custom gift orders.
- **Status Tracking:** Production progress timeline.
- **Export to CSV:** Download orders for reporting.
- **Print Order:** Quick printing of order details.

## Tech Stack
- **Frontend:** React (Vite) + Vanilla CSS
- **Backend:** Node.js + Express (Healthcheck API)
- **Database:** Firebase Firestore
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure
- `frontend/` - Contains the React Vite application.
- `backend/` - Contains the Express server (Health check & backend proxy).

## Development Setup

### 1. Firebase Setup
The app uses Firebase Firestore. You need to create a Firebase project and add your credentials to the frontend environment variables.

### 2. Frontend
```bash
cd frontend
npm install
# Create a .env file based on .env.example and add your Firebase keys
npm run dev
```

### 3. Backend
```bash
cd backend
npm install
npm start
```

## Deployment
Please refer to [DeploymentGuide.md](./DeploymentGuide.md) for detailed instructions on deploying to Render and Netlify.
