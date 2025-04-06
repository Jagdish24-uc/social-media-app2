import React from "react";

const Comment = ({ text, author }) => {
  return (
    <div className="border p-2 rounded bg-gray-50 mb-2">
      <p className="font-semibold">{author}</p>
      <p>{text}</p>
    </div>
  );
};

export default Comment;