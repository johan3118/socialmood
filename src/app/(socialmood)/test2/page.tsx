"use client";
import { useEffect, useState } from "react";
import { fetchManagedPages } from "@/app/api/meta/fb-pages";
import { fetchPagePosts } from "@/app/api/meta/fb-post";
import { fetchPostComments } from "@/app/api/meta/fb-comments";
import { replyToComment } from "@/app/api/meta/fb-reply";

const FacebookFeed = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pageAccessToken, setPageAccessToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPages = async () => {
      try {
        const fetchedPages = await fetchManagedPages();
        console.log("Fetched Pages:", fetchedPages);
        setPages(fetchedPages);

        if (fetchedPages.length > 0) {
          const firstPage = fetchedPages[0];
          setSelectedPageId(firstPage.id);
          setPageAccessToken(firstPage.access_token);
          fetchPostsForPage(firstPage.id, firstPage.access_token);
        }
      } catch (err) {
        console.error("Error fetching pages:", err);
        setError("Failed to fetch pages.");
        setLoading(false);
      }
    };

    loadPages();
  }, []);

  const fetchPostsForPage = async (pageId: string, accessToken: string) => {
    try {
      const fetchedPosts = await fetchPagePosts(pageId, accessToken);
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to fetch posts.");
      setLoading(false);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      if (!pageAccessToken) {
        throw new Error("Page access token is not available.");
      }
      const fetchedComments = await fetchPostComments(postId, pageAccessToken);
      console.log("Fetched Comments for Post:", postId, fetchedComments);

      setComments((prevComments) => ({
        ...prevComments,
        [postId]: fetchedComments,
      }));
    } catch (err) {
      console.error("Error loading comments:", err);
      alert(
        "Unable to load comments. Please ensure the app has the necessary permissions."
      );
    }
  };

  const handleReply = async (commentId: string) => {
    const message = prompt("Enter your reply:");
    if (!message) return;

    try {
      if (!pageAccessToken) {
        throw new Error("Page access token is not available.");
      }
      await replyToComment(commentId, message, pageAccessToken);
      alert("Reply posted successfully!");
    } catch (err) {
      console.error("Error replying to comment:", err);
      alert("Failed to post reply.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Facebook Pages</h1>
      <select
        onChange={(e) => {
          const selectedPage = pages.find((page) => page.id === e.target.value);
          setSelectedPageId(selectedPage.id);
          setPageAccessToken(selectedPage.access_token);
          fetchPostsForPage(selectedPage.id, selectedPage.access_token);
        }}
      >
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>

      <h2>Posts for {selectedPageId}</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <p>{post.message}</p>
            <small>{new Date(post.created_time).toLocaleString()}</small>
            <button onClick={() => loadComments(post.id)}>Load Comments</button>
            {comments[post.id] && (
              <ul>
                {comments[post.id].map((comment: any) => (
                  <li key={comment.id}>
                    {comment.message} -{" "}
                    <strong>{comment.from?.name || "Anonymous"}</strong>
                    <button onClick={() => handleReply(comment.id)}>
                      Reply
                    </button>
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
