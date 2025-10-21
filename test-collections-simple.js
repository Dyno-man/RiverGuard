#!/usr/bin/env node

/**
 * Simple Test for New Collections
 * Quick test to verify the new collections are accessible
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDTAe8zXWeQrff4PX-7FTez2_zgljF433Q",
  authDomain: "trashapi-6eced.firebaseapp.com",
  projectId: "trashapi-6eced",
  storageBucket: "trashapi-6eced.firebasestorage.app",
  messagingSenderId: "39508497787",
  appId: "1:39508497787:web:e84db3ef821789f9a219de",
  measurementId: "G-G5NEYKDVKJ"
}

async function testNewCollections() {
  console.log('🔥 Testing new collections access...')
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase initialized')
    
    // Test videos collection
    console.log('\n📹 Testing videos collection...')
    const videosRef = collection(db, 'videos')
    const testVideo = {
      title: "Test Video - New Collection",
      uploadedAt: new Date(),
      lengthSeconds: 60,
      TimeFrames: 30,
      location: "Test Location"
    }
    
    const videoDocRef = await addDoc(videosRef, testVideo)
    console.log(`✅ Video document created with ID: ${videoDocRef.id}`)
    
    // Test outputData collection
    console.log('\n📊 Testing outputData collection...')
    const outputDataRef = collection(db, 'outputData')
    const testOutputData = {
      trashPerFrame: 2,
      time: 0
    }
    
    const outputDocRef = await addDoc(outputDataRef, testOutputData)
    console.log(`✅ Output data document created with ID: ${outputDocRef.id}`)
    
    // Verify documents exist
    console.log('\n🔍 Verifying documents...')
    const videoDoc = await getDocs(videosRef)
    const outputDoc = await getDocs(outputDataRef)
    
    console.log(`✅ Found ${videoDoc.size} documents in videos collection`)
    console.log(`✅ Found ${outputDoc.size} documents in outputData collection`)
    
    // Clean up test documents
    console.log('\n🧹 Cleaning up test documents...')
    await deleteDoc(doc(db, 'videos', videoDocRef.id))
    await deleteDoc(doc(db, 'outputData', outputDocRef.id))
    console.log('✅ Test documents cleaned up')
    
    console.log('\n🎉 New collections are working perfectly!')
    console.log('✅ videos collection: READY')
    console.log('✅ outputData collection: READY')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('\n🔧 Permission denied! You need to deploy Firestore rules:')
      console.error('1. Run: node deploy-firestore-rules.js')
      console.error('2. Or update rules manually in Firebase Console')
      console.error('3. Make sure rules allow access to videos and outputData collections')
    } else {
      console.error('\n🔧 Other issues:')
      console.error('- Check your internet connection')
      console.error('- Verify Firebase project is active')
      console.error('- Ensure Firestore is enabled')
    }
  }
}

testNewCollections()
