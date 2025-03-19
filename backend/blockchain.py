import hashlib
import time
import json
import os

class Transaction:
    def __init__(self, sender, receiver, content, author):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.author = author
        self.timestamp = time.time()

    def to_dict(self):
        return {
            "sender": self.sender,
            "receiver": self.receiver,
            "content": self.content,
            "author": self.author,
            "timestamp": self.timestamp
        }

class Block:
    def __init__(self, index, previous_hash, transactions, timestamp=None):
        self.index = index
        self.previous_hash = previous_hash
        self.transactions = transactions
        self.timestamp = timestamp or time.time()
        self.nonce = 0
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "previous_hash": self.previous_hash,
            "transactions": [tx.to_dict() for tx in self.transactions],
            "timestamp": self.timestamp,
            "nonce": self.nonce
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def mine_block(self, difficulty):
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()

class Blockchain:
    def __init__(self, difficulty=4):
        self.chain = [self.create_genesis_block()]
        self.difficulty = difficulty
        self.pending_transactions = []
        self.load_from_file()

    def create_genesis_block(self):
        return Block(0, "0", [], time.time())

    def get_latest_block(self):
        return self.chain[-1]

    def add_transaction(self, transaction):
        self.pending_transactions.append(transaction)
        return True

    def mine_pending_transactions(self):
        if not self.pending_transactions:
            return {"message": "No pending transactions to mine", "block_index": None}

        block = Block(len(self.chain), self.get_latest_block().hash, self.pending_transactions)
        block.mine_block(self.difficulty)
        self.chain.append(block)
        self.pending_transactions = []
        self.save_to_file()
        return {"message": f"Block #{len(self.chain) - 1} is mined.", "block_index": len(self.chain) - 1}

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i - 1]
            if current.hash != current.calculate_hash() or current.previous_hash != prev.hash:
                return False
            if current.hash[:self.difficulty] != "0" * self.difficulty:
                return False
        return True

    def save_to_file(self, filename="blockchain.json"):
        with open(filename, 'w') as f:
            json.dump([{
                "index": block.index,
                "hash": block.hash,
                "previous_hash": block.previous_hash,
                "transactions": [tx.to_dict() for tx in block.transactions],
                "timestamp": block.timestamp,
                "nonce": block.nonce
            } for block in self.chain], f, indent=2)

    def load_from_file(self, filename="blockchain.json"):
        if os.path.exists(filename):
            with open(filename, 'r') as f:
                data = json.load(f)
                self.chain = [Block(
                    block_data["index"],
                    block_data["previous_hash"],
                    [Transaction(
                        tx["sender"], tx["receiver"], tx["content"], tx["author"]
                    ) for tx in block_data["transactions"]],
                    block_data["timestamp"]
                ) for block_data in data]
                for block in self.chain:
                    block.hash = block.calculate_hash()

# Khởi tạo blockchain
blockchain = Blockchain()
