from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import hashlib

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Bật CORS cho toàn bộ API

# Simple in-memory storage for posts and replies
posts = []

# Blockchain storage
blockchain = []

def create_block(previous_hash, data=None):
    """Tạo một block mới với dữ liệu tùy chọn"""
    block = {
        "index": len(blockchain) + 1,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "previous_hash": previous_hash,
        "hash": hashlib.sha256(f"{time.time()}{data or ''}".encode()).hexdigest(),
        "data": data or "Mined block"
    }
    return block

# Tạo block đầu tiên (Genesis Block)
genesis_block = create_block(previous_hash="0")
blockchain.append(genesis_block)

@app.route("/posts", methods=["GET", "POST"])
def handle_posts():
    if request.method == "GET":
        return jsonify(posts)
    elif request.method == "POST":
        try:
            data = request.get_json()
            if not data or "author" not in data or "content" not in data:
                return jsonify({"error": "Invalid data"}), 400

            new_post = {
                "id": len(posts) + 1,
                "author": data["author"],
                "content": data["content"],
                "replies": []
            }
            posts.append(new_post)
            return jsonify(new_post), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/posts/<int:post_id>/reply", methods=["POST"])
def add_reply(post_id):
    try:
        data = request.get_json()
        if not data or "content" not in data:
            return jsonify({"error": "Invalid data"}), 400

        for post in posts:
            if post["id"] == post_id:
                post["replies"].append({"content": data["content"]})
                return jsonify(post), 201
        return jsonify({"error": "Post not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/mine', methods=['POST'])
def mine():
    try:
        # Lấy block trước đó để tạo block mới
        previous_block = blockchain[-1]
        new_block = create_block(previous_block["hash"], data="Mined transaction")
        blockchain.append(new_block)
        print(f"Phản hồi mining: {new_block}")  # Thêm log để kiểm tra
        return jsonify({
            "message": "Mining thành công",
            "block": new_block
        }), 200
    except Exception as e:
        print(f"Lỗi mining: {str(e)}")  # Thêm log để kiểm tra lỗi
        return jsonify({"error": str(e)}), 500

@app.route("/chain", methods=["GET"])
def get_chain():
    """Lấy toàn bộ blockchain"""
    print(f"Phản hồi chain: {blockchain}")  # Thêm log để kiểm tra
    return jsonify(blockchain), 200

@app.route("/")
def home():
    return "Welcome to Blockchain API"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)