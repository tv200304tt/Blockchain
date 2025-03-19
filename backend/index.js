const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000; // Có thể thay đổi port cho mỗi instance backend

app.use(express.json());

// Kết nối với MongoDB
mongoose.connect("mongodb://localhost:27017/yournet", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Định nghĩa schema cho Post
const postSchema = new mongoose.Schema({
  id: Number,
  author: String,
  content: String,
  time: String,
  replies: [{
    id: Number,
    author: String,
    content: String,
    time: String,
  }],
});

const Post = mongoose.model("Post", postSchema);

// Lấy tất cả bài đăng
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ id: -1 }); // Sắp xếp theo id giảm dần (mới nhất trước)
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Tạo bài đăng mới
app.post("/posts", async (req, res) => {
  try {
    const post = new Post({ ...req.body, id: Date.now() });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error posting message" });
  }
});

// Thêm reply vào bài đăng
app.post("/posts/:id/replies", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const reply = { ...req.body, id: Date.now() };
    const post = await Post.findOne({ id: postId });
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.replies.push(reply);
    await post.save();
    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: "Error replying to post" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});