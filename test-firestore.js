#!/usr/bin/env node

/**
 * RiverGuard Firestore Connection Test Script
 * 
 * This script tests:
 * 1. Firebase connection
 * 2. Firestore read/write operations
 * 3. API endpoints
 * 4. Data validation
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTAe8zXWeQrff4PX-7FTez2_zgljF433Q",
  authDomain: "trashapi-6eced.firebaseapp.com",
  projectId: "trashapi-6eced",
  storageBucket: "trashapi-6eced.firebasestorage.app",
  messagingSenderId: "39508497787",
  appId: "1:39508497787:web:e84db3ef821789f9a219de",
  measurementId: "G-G5NEYKDVKJ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Test data
const testStream = {
  url: "rtmp://test.example.com/stream",
  streamID: "test-stream-001",
  keepFrames: true,
  status: "Active",
  createdAt: new Date(),
  lastHealthCheck: new Date()
}

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logTest(testName) {
  log(`\n${colors.bold}🧪 Testing: ${testName}${colors.reset}`)
  log('─'.repeat(50))
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

// Test 1: Firebase Connection
async function testFirebaseConnection() {
  logTest('Firebase Connection')
  
  try {
    // Test basic connection by trying to read from Firestore
    const testCollection = collection(db, 'test-connection')
    const snapshot = await getDocs(testCollection)
    logSuccess('Firebase connection established successfully!')
    logInfo(`Connected to project: ${firebaseConfig.projectId}`)
    return true
  } catch (error) {
    logError(`Firebase connection failed: ${error.message}`)
    return false
  }
}

// Test 2: Create Test Document
async function testCreateDocument() {
  logTest('Create Test Document')
  
  try {
    const docRef = await addDoc(collection(db, 'streams'), testStream)
    logSuccess(`Document created with ID: ${docRef.id}`)
    return docRef.id
  } catch (error) {
    logError(`Failed to create document: ${error.message}`)
    return null
  }
}

// Test 3: Read Document
async function testReadDocument(docId) {
  logTest('Read Document')
  
  try {
    const docRef = doc(db, 'streams', docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      logSuccess('Document read successfully!')
      logInfo(`Data: ${JSON.stringify(docSnap.data(), null, 2)}`)
      return true
    } else {
      logError('Document not found!')
      return false
    }
  } catch (error) {
    logError(`Failed to read document: ${error.message}`)
    return false
  }
}

// Test 4: Update Document
async function testUpdateDocument(docId) {
  logTest('Update Document')
  
  try {
    const docRef = doc(db, 'streams', docId)
    await updateDoc(docRef, {
      status: 'Updated',
      lastHealthCheck: new Date()
    })
    logSuccess('Document updated successfully!')
    return true
  } catch (error) {
    logError(`Failed to update document: ${error.message}`)
    return false
  }
}

// Test 5: Query Documents
async function testQueryDocuments() {
  logTest('Query Documents')
  
  try {
    // Test basic query
    const q = query(collection(db, 'streams'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    logSuccess(`Found ${querySnapshot.size} documents`)
    
    // Test filtered query
    const filteredQ = query(collection(db, 'streams'), where('status', '==', 'Updated'))
    const filteredSnapshot = await getDocs(filteredQ)
    
    logSuccess(`Found ${filteredSnapshot.size} documents with status 'Updated'`)
    
    // Display results
    querySnapshot.forEach((doc) => {
      logInfo(`- ${doc.id}: ${doc.data().streamID} (${doc.data().status})`)
    })
    
    return true
  } catch (error) {
    logError(`Failed to query documents: ${error.message}`)
    return false
  }
}

// Test 6: API Endpoints (if server is running)
async function testAPIEndpoints() {
  logTest('API Endpoints')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test GET /api/streams
    logInfo('Testing GET /api/streams...')
    const response = await fetch(`${baseUrl}/api/streams`)
    
    if (response.ok) {
      const data = await response.json()
      logSuccess(`GET /api/streams: ${data.data?.length || 0} streams found`)
    } else {
      logWarning(`GET /api/streams failed: ${response.status} ${response.statusText}`)
    }
    
    // Test POST /api/streams
    logInfo('Testing POST /api/streams...')
    const postResponse = await fetch(`${baseUrl}/api/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'rtmp://api-test.example.com/stream',
        streamID: 'api-test-001',
        keepFrames: true
      })
    })
    
    if (postResponse.ok) {
      const data = await postResponse.json()
      logSuccess(`POST /api/streams: Stream created with ID ${data.data?.id}`)
      return data.data?.id
    } else {
      logWarning(`POST /api/streams failed: ${postResponse.status} ${postResponse.statusText}`)
      return null
    }
    
  } catch (error) {
    logWarning(`API tests failed (server might not be running): ${error.message}`)
    logInfo('Start your Next.js server with: npm run dev')
    return null
  }
}

// Test 7: Cleanup
async function testCleanup(docId) {
  logTest('Cleanup Test Documents')
  
  try {
    if (docId) {
      await deleteDoc(doc(db, 'streams', docId))
      logSuccess(`Test document ${docId} deleted`)
    }
    logSuccess('Cleanup completed!')
    return true
  } catch (error) {
    logError(`Cleanup failed: ${error.message}`)
    return false
  }
}

// Main test runner
async function runTests() {
  log(`${colors.bold}${colors.blue}🚀 RiverGuard Firestore Test Suite${colors.reset}`)
  log('='.repeat(60))
  
  const results = {
    firebaseConnection: false,
    createDocument: false,
    readDocument: false,
    updateDocument: false,
    queryDocuments: false,
    apiEndpoints: false,
    cleanup: false
  }
  
  let createdDocId = null
  
  // Run tests
  results.firebaseConnection = await testFirebaseConnection()
  
  if (results.firebaseConnection) {
    createdDocId = await testCreateDocument()
    results.createDocument = createdDocId !== null
    
    if (results.createDocument) {
      results.readDocument = await testReadDocument(createdDocId)
      results.updateDocument = await testUpdateDocument(createdDocId)
    }
    
    results.queryDocuments = await testQueryDocuments()
  }
  
  // Test API endpoints (optional)
  const apiDocId = await testAPIEndpoints()
  results.apiEndpoints = apiDocId !== null
  
  // Cleanup
  if (createdDocId) {
    results.cleanup = await testCleanup(createdDocId)
  }
  if (apiDocId) {
    await testCleanup(apiDocId)
  }
  
  // Summary
  logTest('Test Summary')
  const passedTests = Object.values(results).filter(Boolean).length
  const totalTests = Object.keys(results).length
  
  log(`${colors.bold}Results: ${passedTests}/${totalTests} tests passed${colors.reset}`)
  
  Object.entries(results).forEach(([test, passed]) => {
    if (passed) {
      logSuccess(`${test}`)
    } else {
      logError(`${test}`)
    }
  })
  
  if (passedTests === totalTests) {
    log(`\n${colors.green}${colors.bold}🎉 All tests passed! Your Firestore connection is working perfectly!${colors.reset}`)
  } else {
    log(`\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Check the errors above.${colors.reset}`)
  }
}

// Run the tests
runTests().catch(console.error)
