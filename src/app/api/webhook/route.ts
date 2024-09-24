// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { fetchPostComments } from '@/app/api/meta/fb-comments';
import { fetchPostDetails } from '@/app/api/meta/fb-post-details'; // This fetches post details via Graph API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === 'my-secret-token-2023') {
    // Return challenge as plain text, not JSON
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Verification failed', { status: 403 });
}

// Handle Facebook Webhook Events (POST request)
export async function POST(request: Request) {
  const body = await request.json();

  if (body.object === 'page') {
    body.entry.forEach(async (entry: any) => {
      const event = entry.changes[0];
      console.log('Event received:', event);

      // Fetch new posts or comments using Graph API
      if (event.field === 'feed') {
        const postId = event.value.post_id || event.value.item_id;  // New post or comment
        console.log(`Post ID: ${postId}`);
        
        // Fetch post details (if it's a new post)
        if (!event.value.comment_id) {
          const postDetails = await fetchPostDetails(postId);
          console.log('Post details:', postDetails);
        }

        // Fetch all comments (if a new comment is detected)
        const comments = await fetchPostComments(postId);
        console.log('Comments:', comments);
      }
    });
  }

  return NextResponse.json({ message: 'Event received' });
}
