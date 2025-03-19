import React, { useState } from "react";
import axios from "axios";

const PostForm = ({ refreshPosts }) => {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!author || !content) return alert("Please enter all fields!");

        await axios.post("http://localhost:5000/posts", { author, content });
        refreshPosts();
        setAuthor("");
        setContent("");
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="bg-gray-100 p-6 rounded-lg shadow-md w-[90%] max-w-[600px] flex flex-col items-center"
        >
            <textarea
                placeholder="Just write whatever you want to..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 border rounded-lg mb-2 text-lg"
            />
            <div className="flex w-full">
                <input
                    type="text"
                    placeholder="Your name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 border rounded-lg text-lg"
                />
                <button className="ml-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700">
                    Post
                </button>
            </div>
        </form>
    );
};

export default PostForm;
