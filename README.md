# Weather App with React & Firebase

A responsive weather application built with React, leveraging OpenWeatherMap API for weather data, Firebase for backend and analytics, and optional background images from Pexels. Users can search for any city, view current weather, forecast, AQI, UV index, and see a beautiful city background.

## Demo

[https://weather-app-96fd4.web.app]

## Prerequisites

- Node.js (>=14.x)
- npm or yarn
- Firebase account and project
- API keys for:
  - **OpenWeatherMap** (free tier)
  - **Pexels** (for background images, optional)
  - **OpenUV** (for UV index)
  - **Google Analytics** (via Firebase)

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### 2. Install dependencies

```
npm install
```
or
```
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with your API keys and Firebase config:

```
VITE_API_BASE_URL=https://<your-firebase-project>.web.app
REACT_APP_OPENWEATHER_API_KEY=your-openweathermap-api-key
REACT_APP_PEXELS_API_KEY=your-pexels-api-key (optional)
REACT_APP_OPENUV_API_KEY=your-openuv-api-key
REACT_APP_FIREBASE_API_KEY=your-firebase-web-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

*(Replace placeholders with your actual keys and IDs)*

### 4. Initialize Firebase & Analytics

- In the Firebase Console, go to **Project Settings > General**.
- Add a new Web App if you haven't already.
- Copy the config snippet including `measurementId`.
- Save the details in your `.env`.

### 5. Set up your Firebase backend

- Run `firebase init` in your project folder.
- Select **Hosting** and **Functions**.
- When prompted, choose your existing Firebase project.
- For Hosting, set `dist` as the public directory.
- For Functions, select JavaScript/TypeScript.
- Deploy your functions:

```
firebase deploy --only functions
```

- Deploy hosting:

```
npm run build
firebase deploy --only hosting
```

## Usage

### Run locally

```
npm run dev
or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Deploy

```
npm run build
firebase deploy --only hosting
```

## Analytics & Tracking

- The app logs user searches and city selections to Google Analytics.
- View real-time data in [Google Analytics > Realtime](https://analytics.google.com/analytics/web/#/realtime)
- Wait up to 24 hours for detailed reports.
