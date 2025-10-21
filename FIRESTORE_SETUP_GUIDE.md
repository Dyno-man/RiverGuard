# Firestore Setup Guide

## 🚨 Current Issue
Your Firestore database has restrictive security rules that are preventing access to all collections, including the existing `streams` collection and the new `videos` and `outputData` collections.

## 🔧 Solution: Update Firestore Security Rules

### Option 1: Firebase Console (Recommended for Quick Fix)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `trashapi-6eced`

2. **Navigate to Firestore Rules**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab

3. **Update the Rules**
   Replace the existing rules with this content:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to streams collection
    match /streams/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to videos collection
    match /videos/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to outputData collection
    match /outputData/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to any other collections for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. **Publish the Rules**
   - Click "Publish" button
   - Wait for the rules to be deployed

### Option 2: Firebase CLI (For Advanced Users)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init firestore
   ```
   - Select your project when prompted
   - Choose to use existing rules file: `firestore.rules`

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

## 🧪 Test Your Setup

After updating the rules, run these tests:

### Quick Test
```bash
node test-collections-simple.js
```

### Comprehensive Test
```bash
node test-new-collections.js
```

### Existing Collections Test
```bash
node simple-test.js
```

## 📊 Expected Results

After fixing the rules, you should see:
- ✅ Firebase initialized
- ✅ Collections accessible
- ✅ Documents can be created, read, updated, and deleted
- ✅ No permission denied errors

## 🔒 Security Notes

**Important**: The rules above are very permissive and should only be used for development. For production, you should implement proper authentication and authorization rules.

### Production Security Rules Example:
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication for all operations
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🆘 Troubleshooting

### If you still get permission errors:
1. Check that you're logged into the correct Google account
2. Verify you have admin access to the Firebase project
3. Make sure Firestore is enabled in your project
4. Try clearing your browser cache and refreshing the Firebase Console

### If Firebase CLI doesn't work:
1. Make sure you're authenticated: `firebase login`
2. Check your project access: `firebase projects:list`
3. Use the Firebase Console method instead

## 📞 Need Help?

If you continue to have issues:
1. Check the Firebase Console for any error messages
2. Verify your project settings in Firebase Console
3. Make sure your Firebase project is active and not suspended
