#!/usr/bin/env node

/**
 * RiverGuard New Collections Test Script
 * 
 * This script tests the new collections:
 * 1. videos - Video metadata and processing information
 * 2. outputData - Trash detection analysis results per frame
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

// Sample data for videos collection
const sampleVideo = {
  title: "River Cleanup Analysis - Downtown Section",
  uploadedAt: new Date(),
  lengthSeconds: 300, // 5 minutes
  TimeFrames: 150, // 2 frames per second
  location: "Downtown River Section - GPS: 40.7128, -74.0060"
}

// Sample data for outputData collection
const sampleOutputData = [
  {
    trashPerFrame: 3,
    time: 0
  },
  {
    trashPerFrame: 1,
    time: 2
  },
  {
    trashPerFrame: 5,
    time: 4
  },
  {
    trashPerFrame: 2,
    time: 6
  },
  {
    trashPerFrame: 0,
    time: 8
  }
]

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

// Test 1: Add video to videos collection
async function testAddVideo() {
  logTest('Add Video to Videos Collection')
  
  try {
    const docRef = await addDoc(collection(db, 'videos'), sampleVideo)
    logSuccess(`Video document created with ID: ${docRef.id}`)
    logInfo(`Video data: ${JSON.stringify(sampleVideo, null, 2)}`)
    return docRef.id
  } catch (error) {
    logError(`Failed to create video document: ${error.message}`)
    return null
  }
}

// Test 2: Add output data to outputData collection
async function testAddOutputData() {
  logTest('Add Output Data to OutputData Collection')
  
  try {
    const docIds = []
    
    for (const data of sampleOutputData) {
      const docRef = await addDoc(collection(db, 'outputData'), data)
      docIds.push(docRef.id)
      logSuccess(`Output data document created with ID: ${docRef.id}`)
    }
    
    logInfo(`Created ${docIds.length} output data documents`)
    return docIds
  } catch (error) {
    logError(`Failed to create output data documents: ${error.message}`)
    return []
  }
}

// Test 3: Read video document
async function testReadVideo(videoId) {
  logTest('Read Video Document')
  
  try {
    const docRef = doc(db, 'videos', videoId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      logSuccess('Video document read successfully!')
      logInfo(`Video data: ${JSON.stringify(docSnap.data(), null, 2)}`)
      return true
    } else {
      logError('Video document not found!')
      return false
    }
  } catch (error) {
    logError(`Failed to read video document: ${error.message}`)
    return false
  }
}

// Test 4: Read output data documents
async function testReadOutputData() {
  logTest('Read Output Data Documents')
  
  try {
    const q = query(collection(db, 'outputData'), orderBy('time', 'asc'))
    const querySnapshot = await getDocs(q)
    
    logSuccess(`Found ${querySnapshot.size} output data documents`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      logInfo(`- ${doc.id}: trashPerFrame=${data.trashPerFrame}, time=${data.time}`)
    })
    
    return true
  } catch (error) {
    logError(`Failed to read output data documents: ${error.message}`)
    return false
  }
}

// Test 5: Query videos by location
async function testQueryVideosByLocation() {
  logTest('Query Videos by Location')
  
  try {
    const q = query(collection(db, 'videos'), where('location', '==', sampleVideo.location))
    const querySnapshot = await getDocs(q)
    
    logSuccess(`Found ${querySnapshot.size} videos at location: ${sampleVideo.location}`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      logInfo(`- ${doc.id}: ${data.title} (${data.lengthSeconds}s)`)
    })
    
    return true
  } catch (error) {
    logError(`Failed to query videos by location: ${error.message}`)
    return false
  }
}

// Test 6: Query output data by trash count
async function testQueryOutputDataByTrash() {
  logTest('Query Output Data by Trash Count')
  
  try {
    const q = query(collection(db, 'outputData'), where('trashPerFrame', '>', 2))
    const querySnapshot = await getDocs(q)
    
    logSuccess(`Found ${querySnapshot.size} frames with more than 2 trash items`)
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      logInfo(`- ${doc.id}: ${data.trashPerFrame} trash items at time ${data.time}`)
    })
    
    return true
  } catch (error) {
    logError(`Failed to query output data by trash count: ${error.message}`)
    return false
  }
}

// Test 7: Update video document
async function testUpdateVideo(videoId) {
  logTest('Update Video Document')
  
  try {
    const docRef = doc(db, 'videos', videoId)
    await updateDoc(docRef, {
      title: "Updated: River Cleanup Analysis - Downtown Section",
      lengthSeconds: 350 // Updated length
    })
    logSuccess('Video document updated successfully!')
    return true
  } catch (error) {
    logError(`Failed to update video document: ${error.message}`)
    return false
  }
}

// Test 8: Cleanup test documents
async function testCleanup(videoId, outputDataIds) {
  logTest('Cleanup Test Documents')
  
  try {
    let cleanedCount = 0
    
    // Delete video document
    if (videoId) {
      await deleteDoc(doc(db, 'videos', videoId))
      logSuccess(`Video document ${videoId} deleted`)
      cleanedCount++
    }
    
    // Delete output data documents
    if (outputDataIds && outputDataIds.length > 0) {
      for (const id of outputDataIds) {
        await deleteDoc(doc(db, 'outputData', id))
        cleanedCount++
      }
      logSuccess(`${outputDataIds.length} output data documents deleted`)
    }
    
    logSuccess(`Cleanup completed! ${cleanedCount} documents deleted`)
    return true
  } catch (error) {
    logError(`Cleanup failed: ${error.message}`)
    return false
  }
}

// Main test runner
async function runNewCollectionTests() {
  log(`${colors.bold}${colors.blue}🚀 RiverGuard New Collections Test Suite${colors.reset}`)
  log('='.repeat(60))
  
  const results = {
    addVideo: false,
    addOutputData: false,
    readVideo: false,
    readOutputData: false,
    queryVideosByLocation: false,
    queryOutputDataByTrash: false,
    updateVideo: false,
    cleanup: false
  }
  
  let createdVideoId = null
  let createdOutputDataIds = []
  
  // Run tests
  createdVideoId = await testAddVideo()
  results.addVideo = createdVideoId !== null
  
  createdOutputDataIds = await testAddOutputData()
  results.addOutputData = createdOutputDataIds.length > 0
  
  if (createdVideoId) {
    results.readVideo = await testReadVideo(createdVideoId)
    results.updateVideo = await testUpdateVideo(createdVideoId)
  }
  
  results.readOutputData = await testReadOutputData()
  results.queryVideosByLocation = await testQueryVideosByLocation()
  results.queryOutputDataByTrash = await testQueryOutputDataByTrash()
  
  // Cleanup
  results.cleanup = await testCleanup(createdVideoId, createdOutputDataIds)
  
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
    log(`\n${colors.green}${colors.bold}🎉 All tests passed! Your new collections are working perfectly!${colors.reset}`)
  } else {
    log(`\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Check the errors above.${colors.reset}`)
  }
}

// Run the tests
runNewCollectionTests().catch(console.error)
