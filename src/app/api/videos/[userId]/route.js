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

// GET - Fetch video by userId from videos collection
// First tries to get by document ID, then queries by userId field if not found
export async function GET(request, { params }) {
  try {
    const { userId } = params
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }
    
    // First, try to get document by ID (in case userId is the document ID)
    const docRef = doc(db, 'videos', userId)
    const docSnap = await getDoc(docRef)
    
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
    
    // If not found by ID, query by userId field
    // Query videos collection by userId field, ordered by uploadDate descending (most recent first)
    let q
    try {
      q = query(
        collection(db, 'videos'), 
        where('userId', '==', userId),
        orderBy('uploadDate', 'desc')
      )
    } catch (orderByError) {
      // If orderBy fails (no index), try without orderBy
      q = query(
        collection(db, 'videos'), 
        where('userId', '==', userId)
      )
    }
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Video not found for this userId' },
        { status: 404 }
      )
    }
    
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
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}

