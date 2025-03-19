import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const Mine = () => {
  const [isMining, setIsMining] = useState(false);
  const [minedBlocks, setMinedBlocks] = useState([]);

  // Load mined blocks from localStorage when the component mounts
  useEffect(() => {
    const storedBlocks = JSON.parse(localStorage.getItem("minedBlocks")) || [];
    console.log("Dữ liệu minedBlocks đã tải từ localStorage:", storedBlocks); // Kiểm tra dữ liệu tải
    setMinedBlocks(storedBlocks);
  }, []);

  // Save mined blocks to localStorage whenever it changes
  useEffect(() => {
    if (minedBlocks.length > 0) {
      localStorage.setItem("minedBlocks", JSON.stringify(minedBlocks));
    }
  }, [minedBlocks]);

  const handleMineBlock = async () => {
    setIsMining(true);

    setTimeout(() => {
      const newBlock = {
        id: minedBlocks.length + 1,
        hash: Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toLocaleString(),
      };
      const updatedBlocks = [...minedBlocks, newBlock];
      setMinedBlocks(updatedBlocks);
      localStorage.setItem("minedBlocks", JSON.stringify(updatedBlocks)); // Ensure localStorage is updated
      setIsMining(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800">⛏️ Mine a New Block</h1>
      <button 
        className="mt-4 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center"
        onClick={handleMineBlock} 
        disabled={isMining}
      >
        {isMining ? <Loader2 className="mr-2 animate-spin" /> : "Mine Block"}
      </button>
      
      {minedBlocks.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">⛓️ Mined Blocks</h2>
          <ul className="border rounded-lg p-4 bg-gray-100">
            {minedBlocks.map((block) => (
              <li key={block.id} className="mb-2 p-3 bg-white rounded-lg shadow flex flex-col">
                <span className="font-bold">Block #{block.id}</span>
                <span className="text-sm text-gray-500">{block.timestamp}</span>
                <span className="text-sm text-green-600">🔗 {block.hash}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Mine;