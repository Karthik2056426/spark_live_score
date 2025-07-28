# Firebase Setup Guide for SPARK

## Step 1: Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "spark-pulse-score" or "st-patricks-spark"
3. Enable Google Analytics (optional)
4. Click "Create project"

## Step 2: Add Web App

1. Click the web icon (</>) on the project overview page
2. Register your app with nickname "SPARK Web App"
3. Click "Register app"
4. **Save the config object** - you'll need it for the next step

## Step 3: Set up Firestore Database

1. In Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

## Step 4: Set up Storage (for winner photos)

1. In Firebase console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select the same location as Firestore
5. Click "Done"

## Step 5: Environment Configuration

Create a `.env` file in the root directory with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id-here
```

Replace the values with your actual Firebase configuration.

## Step 6: Initialize Database

1. Start your development server: `npm run dev`
2. Navigate to `/admin` in your browser
3. Look for the "Initialize Firebase Database" button
4. Click it to populate your database with initial data

## Step 7: Test the Integration

1. Go to the home page (`/`) to see real-time data
2. Add events through the admin panel (`/admin`)
3. Check that scores update in real-time
4. Upload winner photos to test storage

## Database Structure

Your Firestore will have these collections:

- **houses**: House standings and scores
- **events**: Event results and points
- **winners**: Winner information and photos
- **eventTemplates**: Predefined event types

## Security Rules (Optional)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

For production, implement proper authentication and authorization rules.

## Troubleshooting

- **"Firebase not initialized"**: Check your environment variables
- **"Permission denied"**: Make sure Firestore is in test mode
- **"Storage error"**: Check Storage rules and bucket configuration
- **"Real-time updates not working"**: Verify your Firebase config is correct

## Next Steps

1. Add authentication for admin access
2. Implement proper security rules
3. Set up Firebase Hosting for deployment
4. Add offline support with Firebase persistence 