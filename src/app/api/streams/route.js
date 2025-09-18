import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query,
  orderBy,
  where
} from 'firebase/firestore'

// GET - Fetch all streams
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let q = query(collection(db, 'streams'), orderBy('createdAt', 'desc'))
    
    if (status) {
      q = query(collection(db, 'streams'), where('status', '==', status))
    }
    
    const querySnapshot = await getDocs(q)
    const streams = []
    
    querySnapshot.forEach((doc) => {
      streams.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return NextResponse.json({ success: true, data: streams })
  } catch (error) {
    console.error('Error fetching streams:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch streams' },
      { status: 500 }
    )
  }
}

// POST - Create new stream
export async function POST(request) {
  try {
    const body = await request.json()
    const { url, streamID, keepFrames = true } = body
    
    // Validate required fields
    if (!url || !streamID) {
      return NextResponse.json(
        { success: false, error: 'URL and streamID are required' },
        { status: 400 }
      )
    }
    
    const streamData = {
      url,
      streamID,
      keepFrames,
      status: 'Active',
      createdAt: new Date(),
      lastHealthCheck: new Date()
    }
    
    const docRef = await addDoc(collection(db, 'streams'), streamData)
    
    // Send to your backend computer for processing
    await sendToBackendComputer(streamData)
    
    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...streamData }
    })
  } catch (error) {
    console.error('Error creating stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create stream' },
      { status: 500 }
    )
  }
}

// Helper function to send data to your backend computer
async function sendToBackendComputer(streamData) {
  try {
    const backendUrl = process.env.BACKEND_COMPUTER_URL || 'http://localhost:8000'
    
    // Skip backend communication if URL is localhost and we're in development
    if (backendUrl.includes('localhost') && process.env.NODE_ENV === 'development') {
      console.log('⚠️  Backend computer not available (localhost:8000) - stream saved to Firestore only')
      console.log('📝 Stream data that would be sent to backend:', JSON.stringify(streamData, null, 2))
      return
    }
    
    const response = await fetch(`${backendUrl}/api/streams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(streamData)
    })
    
    if (!response.ok) {
      console.error('Failed to send to backend computer:', response.statusText)
    } else {
      console.log('Successfully sent stream data to backend computer')
    }
  } catch (error) {
    console.error('Error sending to backend computer:', error.message)
    console.log('📝 Stream data that would be sent to backend:', JSON.stringify(streamData, null, 2))
  }
}