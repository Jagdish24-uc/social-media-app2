import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LogoutButton from "../components/LogoutButton";
import {
  likePost,
  addComment,
  editPost,
  deletePost,
} from "../redux/postSlice";
import { useNavigate } from "react-router-dom"; 

const formatTimeAgo = (dateString) => {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

const Feed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const posts = useSelector((state) => state.post.posts);
  const user = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [commentInput, setCommentInput] = useState({});
  const [editPostId, setEditPostId] = useState(null);
  const [editText, setEditText] = useState("");

  const postsPerPage = 10;
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handleLike = (postId) => {
    dispatch(likePost({ postId, userId: user?.username }));
  };

  const handleAddComment = (postId) => {
    const text = commentInput[postId];
    if (!text) return;
    dispatch(addComment({ postId, comment: { user: user?.username, text } }));
    setCommentInput({ ...commentInput, [postId]: "" });
  };

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const handleEdit = (postId, currentText) => {
    setEditPostId(postId);
    setEditText(currentText);
  };

  const handleEditSave = (postId) => {
    dispatch(editPost({ postId, text: editText }));
    setEditPostId(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Welcome, {user?.username}!</h2>
        <LogoutButton />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate("/post/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Post
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Edit Profile
        </button>
      </div>

      {/* Posts */}
      {currentPosts.map((post) => {
        const isOwner = user?.username === post.username;

        return (
          <div key={post.id} className="border rounded p-4 mb-4 shadow">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
              <p>Posted by: {post.username}</p>
              <p>{formatTimeAgo(post.createdAt)}</p>
            </div>

            {editPostId === post.id ? (
              <>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => handleEditSave(post.id)}
                    className="text-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditPostId(null)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">{post.text}</h3>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full max-h-[400px] object-cover rounded mb-2"
                  />
                )}
              </>
            )}

            <div className="flex gap-6 items-center text-sm text-gray-700 mt-2">
              <button
                onClick={() => handleLike(post.id)}
                className="hover:text-blue-500"
              >
                👍 Like ({post.likes.length})
              </button>
              <span>💬 Comment ({post.comments.length})</span>
            </div>

            <div className="mt-3">
              <input
                className="border rounded w-full p-1"
                placeholder="Write a comment..."
                value={commentInput[post.id] || ""}
                onChange={(e) =>
                  setCommentInput({
                    ...commentInput,
                    [post.id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => handleAddComment(post.id)}
                className="text-sm mt-1 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Comment
              </button>
            </div>

            <div className="mt-2 text-sm space-y-1">
              {post.comments.map((c, index) => (
                <p key={index} className="bg-gray-100 p-2 rounded">
                  <span className="font-semibold">{c.user}:</span> {c.text}
                </p>
              ))}
            </div>

            {isOwner && (
              <div className="mt-2 flex gap-4 text-sm">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEdit(post.id, post.text)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={startIndex + postsPerPage >= posts.length}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Feed;