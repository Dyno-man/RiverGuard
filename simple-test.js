#!/usr/bin/env node

/**
 * Simple Firestore Connection Test
 * Quick test to verify Firebase connection
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

async function quickTest() {
  console.log('🔥 Testing Firestore connection...')
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    console.log('✅ Firebase initialized')
    
    // Test connection by reading from streams collection
    const streamsRef = collection(db, 'streams')
    const snapshot = await getDocs(streamsRef)
    console.log(`✅ Connected to Firestore! Found ${snapshot.size} existing streams`)
    
    // Test creating a document
    const testDoc = {
      url: 'test://connection-check',
      streamID: 'connection-test',
      keepFrames: true,
      status: 'Test',
      createdAt: new Date(),
      lastHealthCheck: new Date()
    }
    
    const docRef = await addDoc(streamsRef, testDoc)
    console.log(`✅ Test document created with ID: ${docRef.id}`)
    
    // Clean up test document
    await deleteDoc(doc(db, 'streams', docRef.id))
    console.log('✅ Test document cleaned up')
    
    console.log('\n🎉 Firestore connection is working perfectly!')
    
  } catch (error) {
    console.error('❌ Firestore connection failed:', error.message)
    console.error('\nPossible issues:')
    console.error('- Check your internet connection')
    console.error('- Verify Firebase project permissions')
    console.error('- Check if Firestore is enabled in your Firebase console')
  }
}

quickTest()
