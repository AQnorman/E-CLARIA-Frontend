import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const apiUrl = process.env.API_URL;
  
  if (!apiUrl) {
    console.error('API_URL environment variable is not defined');
    return new NextResponse(null, { status: 500 });
  }
  
  try {
    // Get the cookie for authentication
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth_token');
    
    // Construct the full audio URL
    const audioUrl = `${apiUrl}/audio/${id}`;
    console.log('Fetching audio from:', audioUrl);
    
    // Get the audio file from your backend
    const response = await fetch(audioUrl, {
      headers: {
        // Forward authentication headers if needed
        'Cookie': `auth_token=${authCookie?.value || ''}`,
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch audio: ${response.status}`);
      return new NextResponse(null, { 
        status: response.status,
        statusText: response.statusText
      });
    }
    
    // Get the audio data as an array buffer
    const audioData = await response.arrayBuffer();
    
    // Return the audio with appropriate headers
    return new NextResponse(audioData, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Length': response.headers.get('Content-Length') || '',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Audio proxy error:', error);
    return new NextResponse(null, { status: 500 });
  }
}