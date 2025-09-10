# Firebase Setup Guide for MyPortfolio

This guide will help you set up Firebase for your portfolio project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "my-portfolio")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Optionally enable other providers like Google, GitHub, etc.

## 3. Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)

## 4. Get Firebase Configuration

1. Go to Project Settings (gear icon) in the left sidebar
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "my-portfolio-web")
5. Copy the Firebase configuration object

## 5. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your actual Firebase configuration values.

## 6. Set up Firestore Security Rules (Optional but Recommended)

Go to Firestore Database > Rules and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to create new documents
    match /{document=**} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 7. Set up Storage (Optional)

If you want to store images and files:

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location for your storage bucket

## 8. Test Your Setup

You can test your Firebase setup by:

1. Running your development server: `npm run dev`
2. Trying to sign up/sign in through your auth pages
3. Checking the Firebase Console to see if users are being created

## 9. Available Firebase Services

Your project now has access to:

- **Authentication**: User sign-up, sign-in, password reset
- **Firestore**: NoSQL database for storing portfolio data
- **Storage**: File storage for images and documents
- **Real-time updates**: Live data synchronization

## 10. Usage Examples

### Authentication
```typescript
import { useAuth } from '@/lib/AuthContext';
import { signIn, signUp, logout } from '@/lib/auth';

// In a component
const { user, loading } = useAuth();

// Sign up
const handleSignUp = async (email: string, password: string) => {
  const { user, error } = await signUp(email, password, 'John Doe');
  if (error) {
    console.error('Sign up error:', error);
  }
};
```

### Firestore Operations
```typescript
import { createDocument, getCollection, updateDocument } from '@/lib/firestore';

// Create a project
const { id, error } = await createDocument('projects', {
  userId: user.uid,
  title: 'My Project',
  description: 'Project description',
  techStack: ['React', 'TypeScript'],
  featured: true
});

// Get user's projects
const { data: projects } = await getProjects(user.uid);
```

## Troubleshooting

- **Environment variables not working**: Make sure your `.env.local` file is in the project root and restart your development server
- **Authentication not working**: Check that Email/Password is enabled in Firebase Console
- **Firestore permission denied**: Verify your security rules and that users are authenticated
- **CORS errors**: Make sure your domain is added to authorized domains in Firebase Console

## Next Steps

1. Implement authentication forms in your auth pages
2. Create data management forms for portfolio content
3. Set up image upload functionality using Firebase Storage
4. Implement real-time updates for collaborative features
5. Add data validation and error handling
