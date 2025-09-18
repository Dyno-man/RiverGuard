import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// GET - Fetch single stream
export async function GET(request, { params }) {
  try {
    const { id } = params
    const streamRef = doc(db, 'streams', id)
    const streamSnap = await getDoc(streamRef)
    
    if (!streamSnap.exists()) {
      return NextResponse.json(
        { success: false, error: 'Stream not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: { id: streamSnap.id, ...streamSnap.data() }
    })
  } catch (error) {
    console.error('Error fetching stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stream' },
      { status: 500 }
    )
  }
}

// PUT - Update stream
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const streamRef = doc(db, 'streams', id)
    await updateDoc(streamRef, {
      ...body,
      lastHealthCheck: new Date()
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update stream' },
      { status: 500 }
    )
  }
}

// DELETE - Delete stream
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const streamRef = doc(db, 'streams', id)
    await deleteDoc(streamRef)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting stream:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete stream' },
      { status: 500 }
    )
  }
}