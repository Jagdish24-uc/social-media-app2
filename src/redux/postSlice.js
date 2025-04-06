import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const saveToLocalStorage = (posts) => {
  localStorage.setItem("posts", JSON.stringify(posts));
};

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || [],
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      const post = {
        ...action.payload,
        id: uuid(),
        comments: [],
        likes: [],
        createdAt: new Date().toISOString(),
      };
      state.posts.unshift(post);
      saveToLocalStorage(state.posts);
    },

    likePost: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      const index = post.likes.indexOf(userId);
      if (index > -1) {
        post.likes.splice(index, 1); // Unlike
      } else {
        post.likes.push(userId); // Like
      }
      saveToLocalStorage(state.posts);
    },

    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      post.comments.push({ ...comment, id: uuid(), createdAt: new Date().toISOString() });
      saveToLocalStorage(state.posts);
    },

    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
      saveToLocalStorage(state.posts);
    },

    editPost: (state, action) => {
      const { postId, newText, newImage } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      post.text = newText !== undefined ? newText : post.text;
      post.image = newImage !== undefined ? newImage : post.image;
      saveToLocalStorage(state.posts);
    },

    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post) return;

      post.comments = post.comments.filter((c) => c.id !== commentId);
      saveToLocalStorage(state.posts);
    },
  },
});

export const {
  addPost,
  likePost,
  addComment,
  deletePost,
  editPost,
  deleteComment,
} = postSlice.actions;
export default postSlice.reducer;