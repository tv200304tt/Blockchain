import React from "react";

const PostList = ({ posts, onReply, replyTo, replyName, setReplyName, replyMessage, setReplyMessage, handleReply }) => {
  return (
    <div className="max-w-md mx-auto w-full">
      {posts.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No posts yet. Add one! 📝</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg">
                {post.author[0].toUpperCase()}
              </div>
              <h3 className="text-lg font-semibold">{post.author}</h3>
            </div>
            <p className="text-gray-700 mt-2 text-lg">{post.content}</p>
            <p className="text-sm text-gray-500 mt-1">Posted at {post.time}</p>
            <button className="text-blue-600 mt-2" onClick={() => onReply(post.id)}>
              Reply
            </button>

            {/* Form trả lời (nếu đang trả lời bài này) */}
            {replyTo === post.id && (
              <div className="mt-4 p-2 border rounded">
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Your reply name (role)"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  placeholder="Write your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handleReply(post.id)}
                >
                  Submit Reply
                </button>
              </div>
            )}

            {/* Hiển thị các trả lời (replies) */}
            {post.replies && post.replies.length > 0 && (
              <div className="mt-4 ml-4 border-l-2 pl-4">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-100 p-2 rounded-lg mb-2">
                    <p className="text-gray-700"><strong>{reply.author}</strong>: {reply.content}</p>
                    <p className="text-sm text-gray-500">Replied at {reply.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;