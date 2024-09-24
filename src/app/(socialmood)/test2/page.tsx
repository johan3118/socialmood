"use client";
import { useEffect, useState } from "react";
import { fetchLastPosts } from "@/app/api/meta/fb-post"; // Utility to fetch posts
import { fetchPostComments } from "@/app/api/meta/fb-comments"; // Utility to fetch comments

const FacebookFeed = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store fetched posts
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the latest posts on initial load
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchLastPosts();
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts.");
        setLoading(false);
      }
    };

    loadPosts();

    // Set up webhook listener to fetch new posts and comments in real time
    const setupWebhookListener = async () => {
      try {
        const response = await fetch("/api/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Error setting up webhook listener.");
        }
      } catch (error) {
        console.error("Error setting up webhook listener:", error);
      }
    };

    setupWebhookListener();
  }, []);

  // Fetch comments for a specific post
  const loadComments = async (postId: string) => {
    try {
      const comments = await fetchPostComments(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments } : post
        )
      );
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Facebook Feed</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>{post.message}</p>
            <small>{new Date(post.created_time).toLocaleString()}</small>
            <button onClick={() => loadComments(post.id)}>Load Comments</button>
            {post.comments && (
              <ul>
                {post.comments.map((comment: any) => (
                  <li key={comment.id}>
                    {comment.message} - <strong>{comment.from.name}</strong>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FacebookFeed;
