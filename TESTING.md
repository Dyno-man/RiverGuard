# RiverGuard Testing Guide

This guide explains how to test your Firestore connection and API endpoints.

## 🧪 Test Scripts

### 1. Simple Firestore Test
Quick test to verify basic Firestore connection:

```bash
npm run test:simple
```

**What it tests:**
- Firebase initialization
- Firestore connection
- Document creation
- Document cleanup

### 2. Comprehensive Test Suite
Full test suite with detailed reporting:

```bash
npm run test:firestore
```

**What it tests:**
- Firebase connection
- Document CRUD operations
- Query operations
- API endpoints (if server is running)
- Data validation
- Cleanup

## 🚀 Running Tests

### Prerequisites
1. Make sure you have an internet connection
2. Ensure your Firebase project has Firestore enabled
3. Verify your Firebase credentials are correct

### Quick Start
```bash
# Simple test
npm run test:simple

# Full test suite
npm run test:firestore
```

### Test with API Server
To test API endpoints, start your Next.js server first:

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Run tests
npm run test:firestore
```

## 📊 Understanding Test Results

### ✅ Success Indicators
- Green checkmarks (✅) indicate successful tests
- Blue info messages (ℹ️) show additional information
- Test summary shows passed/total tests

### ❌ Common Issues

**Firebase Connection Failed:**
- Check internet connection
- Verify Firebase project is active
- Ensure Firestore is enabled in Firebase Console

**Permission Denied:**
- Check Firebase security rules
- Verify your Firebase project permissions

**API Tests Failed:**
- Make sure Next.js server is running (`npm run dev`)
- Check if port 3000 is available

## 🔧 Troubleshooting

### Firebase Issues
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`trashapi-6eced`)
3. Go to Firestore Database
4. Ensure it's enabled and rules allow read/write

### API Issues
1. Check if server is running: `curl http://localhost:3000/api/streams`
2. Look for error messages in server console
3. Verify middleware is working correctly

### Network Issues
1. Check firewall settings
2. Verify proxy configuration
3. Test with different network

## 📝 Test Data

The test scripts create temporary documents with these fields:
- `url`: Test stream URL
- `streamID`: Unique identifier
- `keepFrames`: Boolean flag
- `status`: Document status
- `createdAt`: Creation timestamp
- `lastHealthCheck`: Last health check timestamp

All test data is automatically cleaned up after testing.

## 🎯 Expected Results

**Successful Test Output:**
```
🔥 Testing Firestore connection...
✅ Firebase initialized
✅ Connected to Firestore! Found X existing streams
✅ Test document created with ID: abc123
✅ Test document cleaned up

🎉 Firestore connection is working perfectly!
```

**Failed Test Output:**
```
❌ Firestore connection failed: Permission denied
```

## 📞 Support

If tests continue to fail:
1. Check Firebase Console for error logs
2. Verify your Firebase configuration
3. Ensure all dependencies are installed (`npm install`)
4. Check Next.js server logs for API errors

## 🔄 Running Tests Multiple Times

The test scripts are safe to run multiple times:
- Test data is automatically cleaned up
- No permanent changes to your database
- Can be used for continuous integration

Happy testing! 🚀
