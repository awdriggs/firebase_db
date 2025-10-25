# Playlist App with Firebase Firestore

A simple Node.js playlist app using Firebase Firestore for data persistence. Perfect for learning Firebase basics and deploying on Render.

## What is Firebase?

Firebase is a platform by Google that provides backend services for web and mobile apps. Firestore is Firebase's NoSQL database that stores data in collections and documents.

## Setup

### 1. Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Create a new Firebase project"
3. Enter a project name (e.g., "my-playlist-app")
4. You can disable Google Analytics (not needed for this tutorial)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, click "Build" in the left sidebar
2. Click "Firestore Database"
3. Click "Create database"
4. Choose "Start in test mode" (easier for learning)
5. Select a location close to you (e.g., `us-east1`)
6. Click "Enable"

### 3. Get Firebase Credentials

1. In your Firebase project, click the gear icon (Settings) → "Project settings"
2. Go to the "Service accounts" tab
3. Click "Generate new private key"
4. A JSON file will download - keep this safe!
5. Open the JSON file - you'll need three values from it:
   - `project_id`
   - `client_email`
   - `private_key`

### 4. Set up Environment Variables

Create a `.env` file in the project root (copy from .env.example):

```
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_client_email_here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_private_key_here\n-----END PRIVATE KEY-----\n"
```

**Important:**
- Copy the values from your downloaded JSON file
- The private key should be wrapped in quotes
- Keep the `\n` characters in the private key

### 5. Install and Run

```bash
npm install
npm start
```

Visit http://localhost:3000

## Deploy to Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`!)
2. Create a new Web Service on Render
3. Connect your repository
4. Add environment variables in Render dashboard:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
5. Deploy!

**Note:** When adding the `FIREBASE_PRIVATE_KEY` to Render, paste it exactly as it appears in your `.env` file (with quotes and `\n` characters).

## API Routes

- `GET /songs` - Get all songs
- `POST /songs` - Add a song (send JSON: `{"title": "Song Name", "artist": "Artist Name"}`)
- `DELETE /songs/:id` - Delete a song by ID

## How It Works

- **Express**: Web server that handles HTTP requests
- **Firebase Firestore**: NoSQL database that stores songs in a collection
- **Environment Variables**: Keep Firebase credentials secure
- Each song is stored as a document in the `songs` collection
- Songs are automatically ordered by creation date (newest first)
