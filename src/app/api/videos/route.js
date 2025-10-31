import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { 
  collection, 
  getDocs, 
  query,
  orderBy
} from 'firebase/firestore'

// Helper function to normalize strings for comparison (spaces to dashes, lowercase)
function normalizeForSearch(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '-').replace(/-+/g, '-')
}

// GET - Fetch all userIds from videos collection for search/autocomplete
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    
    // Normalize search query (spaces to dashes) for flexible matching
    const normalizedSearch = search ? normalizeForSearch(search) : ''
    
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
        if (!normalizedSearch) {
          // No search - include all
          userIds.push({
            userId: userId,
            videoFilename: data.videoFilename || '',
            uploadDate: data.uploadDate || data.createdAt
          })
          seenUserIds.add(userId)
        } else {
          // Normalize userId for comparison
          const normalizedUserId = normalizeForSearch(userId)
          // Check if normalized search matches normalized userId (also check original for partial matches)
          if (normalizedUserId.includes(normalizedSearch) || userId.toLowerCase().includes(search.toLowerCase())) {
            userIds.push({
              userId: userId,
              videoFilename: data.videoFilename || '',
              uploadDate: data.uploadDate || data.createdAt
            })
            seenUserIds.add(userId)
          }
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

