import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  query,
  orderBy
} from 'firebase/firestore'

// GET - Fetch all userIds from videos collection for search/autocomplete
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Get all videos, ordered by uploadDate descending (if index exists)
    let q
    try {
      q = query(
        collection(db, 'videos'), 
        orderBy('uploadDate', 'desc')
      )
    } catch (orderByError) {
      // If orderBy fails (no index), just get all videos without ordering
      q = collection(db, 'videos')
    }
    
    const querySnapshot = await getDocs(q)
    const userIds = []
    const seenUserIds = new Set()
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      const userId = data.userId || doc.id
      
      // Deduplicate and filter by search term if provided
      if (!seenUserIds.has(userId)) {
        if (!search || userId.toLowerCase().includes(search.toLowerCase())) {
          userIds.push({
            userId: userId,
            videoFilename: data.videoFilename || '',
            uploadDate: data.uploadDate || data.createdAt
          })
          seenUserIds.add(userId)
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: userIds
    })
  } catch (error) {
    console.error('Error fetching userIds:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch userIds' },
      { status: 500 }
    )
  }
}

