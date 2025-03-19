import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="mb-4 flex gap-4">
      <Link to="/" className="text-blue-500">Home</Link>
      <Link to="/mine" className="text-blue-500">Mine</Link>
      <Link to="/transactions" className="text-blue-500">Transactions</Link>
    </nav>
  );
}
