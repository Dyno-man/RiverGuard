import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Get the backend URL from environment variable
    // Note: This can be HTTP - server-side requests don't have mixed content restrictions
    // Set in Vercel: http://192.155.92.114/api/fileUpload (or your backend URL)
    const backendUrl = process.env.BACKEND_UPLOAD_URL || 'http://192.155.92.114/api/fileUpload'
    
    // Forward the form data to the backend
    // Server-side fetch can call HTTP endpoints even though Vercel serves over HTTPS
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let fetch set it with boundary for multipart/form-data
    })
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend upload error:', errorText)
      return NextResponse.json(
        { success: false, error: `Upload failed: ${backendResponse.statusText}` },
        { status: backendResponse.status }
      )
    }
    
    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload file' },
      { status: 500 }
    )
  }
}

