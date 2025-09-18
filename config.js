// RiverGuard Configuration
export const config = {
  // Backend Computer URL (where your ML algorithm runs)
  backendUrl: process.env.BACKEND_COMPUTER_URL || 'http://localhost:8000',
  
  // Firebase Configuration (already configured in firebase.js)
  firebase: {
    apiKey: "AIzaSyDTAe8zXWeQrff4PX-7FTez2_zgljF433Q",
    authDomain: "trashapi-6eced.firebaseapp.com",
    projectId: "trashapi-6eced",
    storageBucket: "trashapi-6eced.firebasestorage.app",
    messagingSenderId: "39508497787",
    appId: "1:39508497787:web:e84db3ef821789f9a219de"
  },
  
  // Optional settings
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true' || false,
  debugMode: process.env.DEBUG_MODE === 'true' || false
}
