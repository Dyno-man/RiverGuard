#!/usr/bin/env node

/**
 * Add Structured Test Data Script
 * 
 * This script adds sample data to the collections with the correct structure:
 * - videos: individual video documents
 * - outputData: one document per video with an array of data points
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDTAe8zXWeQrff4PX-7FTez2_zgljF433Q",
  authDomain: "trashapi-6eced.firebaseapp.com",
  projectId: "trashapi-6eced",
  storageBucket: "trashapi-6eced.firebasestorage.app",
  messagingSenderId: "39508497787",
  appId: "1:39508497787:web:e84db3ef821789f9a219de",
  measurementId: "G-G5NEYKDVKJ"
}

// Sample video data
const sampleVideos = [
  {
    title: "River Cleanup Analysis - Downtown Section",
    uploadedAt: new Date('2024-10-15T09:30:00Z'),
    lengthSeconds: 300,
    TimeFrames: 150,
    location: "Downtown River Section - GPS: 40.7128, -74.0060"
  },
  {
    title: "Morning Trash Detection - Riverside Park",
    uploadedAt: new Date('2024-10-16T07:15:00Z'),
    lengthSeconds: 180,
    TimeFrames: 90,
    location: "Riverside Park - GPS: 40.7589, -73.9851"
  },
  {
    title: "Afternoon Analysis - Industrial Zone",
    uploadedAt: new Date('2024-10-17T14:45:00Z'),
    lengthSeconds: 420,
    TimeFrames: 210,
    location: "Industrial Zone River - GPS: 40.6782, -74.0112"
  }
]

// Sample output data arrays for each video
const sampleOutputDataArrays = [
  // Data for Downtown Section (10 data points)
  [
    { time: 0, trashPerFrame: 3 },
    { time: 2, trashPerFrame: 1 },
    { time: 4, trashPerFrame: 5 },
    { time: 6, trashPerFrame: 2 },
    { time: 8, trashPerFrame: 0 },
    { time: 10, trashPerFrame: 4 },
    { time: 12, trashPerFrame: 1 },
    { time: 14, trashPerFrame: 3 },
    { time: 16, trashPerFrame: 2 },
    { time: 18, trashPerFrame: 0 }
  ],
  
  // Data for Riverside Park (10 data points)
  [
    { time: 0, trashPerFrame: 2 },
    { time: 2, trashPerFrame: 1 },
    { time: 4, trashPerFrame: 0 },
    { time: 6, trashPerFrame: 3 },
    { time: 8, trashPerFrame: 1 },
    { time: 10, trashPerFrame: 2 },
    { time: 12, trashPerFrame: 0 },
    { time: 14, trashPerFrame: 1 },
    { time: 16, trashPerFrame: 2 },
    { time: 18, trashPerFrame: 1 }
  ],
  
  // Data for Industrial Zone (10 data points)
  [
    { time: 0, trashPerFrame: 6 },
    { time: 2, trashPerFrame: 4 },
    { time: 4, trashPerFrame: 8 },
    { time: 6, trashPerFrame: 3 },
    { time: 8, trashPerFrame: 7 },
    { time: 10, trashPerFrame: 5 },
    { time: 12, trashPerFrame: 9 },
    { time: 14, trashPerFrame: 2 },
    { time: 16, trashPerFrame: 6 },
    { time: 18, trashPerFrame: 4 }
  ]
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

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue')
}

async function addStructuredTestData() {
  log(`${colors.bold}${colors.blue}📊 Adding Structured Test Data${colors.reset}`)
  log('='.repeat(60))
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    logSuccess('Firebase initialized')
    
    // Add videos and collect their IDs
    log('\n📹 Adding sample videos...')
    const videoIds = []
    
    for (let i = 0; i < sampleVideos.length; i++) {
      const video = sampleVideos[i]
      const docRef = await addDoc(collection(db, 'videos'), video)
      videoIds.push(docRef.id)
      logSuccess(`Video ${i + 1} added: "${video.title}" (ID: ${docRef.id})`)
    }
    
    // Add output data with arrays
    log('\n📊 Adding structured output data...')
    const outputDataIds = []
    
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i]
      const dataPoints = sampleOutputDataArrays[i]
      
      const outputDataDoc = {
        videoId: videoId,
        dataPoints: dataPoints
      }
      
      const docRef = await addDoc(collection(db, 'outputData'), outputDataDoc)
      outputDataIds.push(docRef.id)
      
      logSuccess(`Output data for video ${i + 1} added: ${dataPoints.length} data points (ID: ${docRef.id})`)
      logInfo(`  Video ID: ${videoId}`)
      logInfo(`  Data points: ${dataPoints.map(dp => `(${dp.time},${dp.trashPerFrame})`).join(', ')}`)
    }
    
    // Summary
    log('\n' + '='.repeat(60))
    logSuccess(`Structured test data added successfully!`)
    logInfo(`📹 Videos added: ${videoIds.length}`)
    logInfo(`📊 Output data documents added: ${outputDataIds.length}`)
    
    log('\n🔍 View your data in Firebase Console:')
    log('1. Go to: https://console.firebase.google.com/')
    log('2. Select project: trashapi-6eced')
    log('3. Go to Firestore Database')
    log('4. Browse the "videos" and "outputData" collections')
    
    log('\n📋 Data Structure:')
    log('Videos: Individual documents with metadata')
    log('OutputData: One document per video with dataPoints array')
    log('  - Each outputData document contains:')
    log('    - videoId: Reference to the video')
    log('    - dataPoints: Array of {time, trashPerFrame} objects')
    
    log('\n📊 Sample Data Points:')
    sampleOutputDataArrays.forEach((dataArray, index) => {
      log(`Video ${index + 1}: [${dataArray.map(dp => `(${dp.time},${dp.trashPerFrame})`).join(', ')}]`)
    })
    
    log(`\n${colors.green}${colors.bold}🎉 Structured test data is now available in your Firestore database!${colors.reset}`)
    
  } catch (error) {
    logError(`Failed to add structured test data: ${error.message}`)
    
    if (error.message.includes('PERMISSION_DENIED')) {
      logError('\n🔧 Permission denied! Make sure Firestore rules are updated.')
      logInfo('Check the FIRESTORE_SETUP_GUIDE.md for instructions.')
    }
  }
}

// Run the script
addStructuredTestData()
