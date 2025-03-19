import React, { useState, useEffect } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Load giao dịch từ localStorage khi component mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Lưu giao dịch vào localStorage mỗi khi transactions thay đổi
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleNewTransaction = () => {
    const newTransaction = {
      id: transactions.length + 1,
      sender: "User123",
      receiver: "User456",
      amount: (Math.random() * 10).toFixed(2),
      timestamp: new Date().toLocaleString(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);

    // Debugging: Kiểm tra giá trị trước khi lưu
    console.log("Dữ liệu giao dịch đã cập nhật:", updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] p-6">
      <h1 className="text-3xl font-bold text-gray-800">🔄 Transaction List</h1>
      <button
        className="mt-4 bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg"
        onClick={handleNewTransaction}
      >
        Add New Transaction
      </button>

      {transactions.length > 0 ? (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">📜 Transactions</h2>
          <ul className="border rounded-lg p-4 bg-gray-100">
            {transactions.map((tx) => (
              <li key={tx.id} className="mb-2 p-3 bg-white rounded-lg shadow flex flex-col">
                <span className="font-bold">Transaction #{tx.id}</span>
                <span className="text-sm text-gray-500">{tx.timestamp}</span>
                <span className="text-sm text-blue-600">💰 {tx.amount} ETH</span>
                <span className="text-sm">🔄 {tx.sender} ➝ {tx.receiver}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No transactions yet. Try adding one!</p>
      )}
    </div>
  );
};

export default Transactions;