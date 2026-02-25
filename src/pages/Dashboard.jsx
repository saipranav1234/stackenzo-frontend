import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await axios.get("/api/logout", { withCredentials: true });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wider">SecureApp</h2>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
          Logout
        </button>
      </nav>

      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to your Dashboard</h1>
          <p className="text-lg text-gray-600">You are successfully authenticated using our Magic Link/OTP system.</p>
          <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium">
            ✨ Pro Tip: You can now access all protected routes.
          </div>
        </div>
      </main>
    </div>
  );
}