import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chain, setChain] = useState([]); // Lưu blockchain từ backend
  const API_URL = "http://192.168.1.10:5000"; // Cập nhật địa chỉ backend của bạn

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  // Lưu bài viết vào localStorage khi posts thay đổi
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts]);

  const handlePost = () => {
    if (name.trim() && message.trim()) {
      const newPost = {
        id: Date.now(),
        name,
        message,
        time: new Date().toLocaleString(),
        replies: [],
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      setName("");
      setMessage("");
    }
  };

  // 🛠️ Yêu cầu mine block mới
  const handleMineBlock = async () => {
    try {
      const response = await fetch(`${API_URL}/mine`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Mining failed");
      }
      const data = await response.json();
      console.log("Phản hồi mining:", data); // Thêm log để kiểm tra dữ liệu trả về
      // Tạo một block mới và lưu vào localStorage
      const newBlock = {
        id: JSON.parse(localStorage.getItem("minedBlocks"))?.length + 1 || 1,
        hash: data.block?.hash || Math.random().toString(36).substring(2, 15), // Sử dụng hash từ backend nếu có
        timestamp: data.block?.timestamp || new Date().toLocaleString(),
      };
      const currentBlocks = JSON.parse(localStorage.getItem("minedBlocks")) || [];
      const updatedBlocks = [...currentBlocks, newBlock];
      localStorage.setItem("minedBlocks", JSON.stringify(updatedBlocks));
      console.log("Dữ liệu minedBlocks đã cập nhật trong localStorage:", updatedBlocks); // Kiểm tra dữ liệu lưu
      alert("Mining thành công! Kiểm tra phần Mine ⛏️");
    } catch (error) {
      console.error("Mining thất bại:", error);
      alert("Mining thất bại ❌. Kiểm tra mạng.");
    }
  };

  // 🔄 Đồng bộ lại blockchain từ backend
  const handleResync = async () => {
    try {
      const response = await axios.get(`${API_URL}/chain`);
      console.log("Phản hồi resync:", response.data); // Thêm log để kiểm tra dữ liệu trả về
      // Chuyển đổi dữ liệu blockchain thành định dạng phù hợp cho minedBlocks
      const transformedBlocks = response.data.map((block, index) => ({
        id: block.index,
        hash: block.hash,
        timestamp: block.timestamp,
      }));
      setChain(response.data);
      localStorage.setItem("minedBlocks", JSON.stringify(transformedBlocks));
      console.log("Dữ liệu minedBlocks đã cập nhật trong localStorage sau resync:", transformedBlocks);
      alert("Blockchain đã đồng bộ lại thành công! 🔄");
    } catch (error) {
      console.error("Resync thất bại:", error);
      alert("Resync thất bại ❌. Kiểm tra mạng.");
    }
  };

  return (
    <div className="container">
      <h1>YourNet: Decentralized content sharing</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <textarea
          placeholder="Just write whatever you want to..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </form>

      <div className="button-container">
        <button onClick={handleMineBlock}>Request to mine ⛏️</button>
        <button onClick={handleResync}>Resync 🔄</button>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet. Add one! 📝</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <strong>{post.name}</strong> <br />
              <small>Posted at {post.time}</small>
              <p>{post.message}</p>
            </div>
          ))
        )}
      </div>

      <div className="chain-list">
        <h2>Blockchain Data 🔗</h2>
        {chain.length === 0 ? (
          <p>No blocks mined yet.</p>
        ) : (
          chain.map((block) => (
            <div key={block.index} className="block-item">
              <p><strong>Block {block.index}</strong></p>
              <p>⏳ Time: {block.timestamp}</p>
              <p>🔗 Hash: {block.hash}</p>
              <p>🕵️‍♂️ Previous: {block.previous_hash}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}