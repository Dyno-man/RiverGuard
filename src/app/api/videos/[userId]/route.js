import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { 
  collection, 
  doc,
  getDoc,
  getDocs, 
  query,
  where,
  orderBy
} from 'firebase/firestore'

// Helper function to normalize strings (spaces to dashes, lowercase, etc.)
function normalizeForSearch(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '-').replace(/-+/g, '-')
}

// GET - Fetch video by userId from videos collection
// First tries to get by document ID, then queries by userId field if not found
// Supports searching with spaces (normalizes to dashes for matching)
export async function GET(request, { params }) {
  try {
    let { userId } = params
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }
    
    // Decode the userId from URL
    userId = decodeURIComponent(userId)
    
    // First, try to get document by ID with exact userId
    let docRef = doc(db, 'videos', userId)
    let docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const videoData = {
        id: docSnap.id,
        ...docSnap.data()
      }
      
      return NextResponse.json({
        success: true,
        data: videoData
      })
    }
    
    // If not found, normalize the userId (spaces to dashes) and try again
    const normalizedUserId = normalizeForSearch(userId)
    if (normalizedUserId !== userId.toLowerCase()) {
      docRef = doc(db, 'videos', normalizedUserId)
      docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const videoData = {
          id: docSnap.id,
          ...docSnap.data()
        }
        
        return NextResponse.json({
          success: true,
          data: videoData
        })
      }
    }
    
    // If not found by ID, query by userId field (try both original and normalized)
    // First try exact match
    let q
    try {
      q = query(
        collection(db, 'videos'), 
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc')
      )
    } catch (orderByError) {
      q = query(
        collection(db, 'videos'), 
        where('userId', '==', userId)
      )
    }
    
    let querySnapshot = await getDocs(q)
    
    // If not found with exact match, try normalized version
    if (querySnapshot.empty && normalizedUserId !== userId.toLowerCase()) {
      try {
        q = query(
          collection(db, 'videos'), 
          where('userId', '==', normalizedUserId),
          orderBy('uploadDate', 'desc')
        )
      } catch (orderByError) {
        q = query(
          collection(db, 'videos'), 
          where('userId', '==', normalizedUserId)
        )
      }
      querySnapshot = await getDocs(q)
    }
    
    // If still not found, try case-insensitive search by getting all and filtering
    if (querySnapshot.empty) {
      const allVideosQuery = query(collection(db, 'videos'))
      const allDocs = await getDocs(allVideosQuery)
      
      const normalizedSearch = normalizeForSearch(userId)
      for (const docSnap of allDocs.docs) {
        const data = docSnap.data()
        const docUserId = data.userId || docSnap.id
        const normalizedDocUserId = normalizeForSearch(docUserId)
        
        if (normalizedDocUserId === normalizedSearch || docUserId.toLowerCase() === userId.toLowerCase()) {
          const videoData = {
            id: docSnap.id,
            ...data
          }
          
          return NextResponse.json({
            success: true,
            data: videoData
          })
        }
      }
    } else {
      // Get the most recent video for this userId
      const latestDoc = querySnapshot.docs[0]
      const videoData = {
        id: latestDoc.id,
        ...latestDoc.data()
      }
      
      return NextResponse.json({
        success: true,
        data: videoData
      })
    }
    
    // Not found
    return NextResponse.json(
      { success: false, error: 'Video not found for this userId' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}

