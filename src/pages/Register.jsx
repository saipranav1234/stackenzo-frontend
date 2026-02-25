import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", method: "link" });
  
  // Toast State: { message: string, type: 'success' | 'error' | null }
  const [toast, setToast] = useState({ message: "", type: null });

  // Function to trigger toast and auto-hide
  const triggerToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: null }), 4000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/register", form, { withCredentials: true });
      
      triggerToast(res.data.message || "Registration Successful!", "success");

      // Wait a moment for them to see the toast before navigating
      setTimeout(() => {
        if (form.method === "otp") {
          navigate("/verify-otp", { state: { email: form.email } });
        } else {
          navigate("/", { state: { email: form.email } });
        }
      }, 1500);
      
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error during registration";
      const lowError = errorMsg.toLowerCase();

      if (lowError.includes("account_unverified") || lowError.includes("already registered")) {
        triggerToast("Email already exists. Redirecting...", "error");
        setTimeout(() => navigate("/", { state: { email: form.email } }), 1500);
      } else {
        triggerToast(errorMsg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans relative overflow-hidden">
      
      {/* --- CUSTOM TOAST NOTIFICATION --- */}
      {toast.type && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all duration-500 animate-in slide-in-from-top-full
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          <span className="font-bold">
            {toast.type === "success" ? "✓" : "✕"}
          </span>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Full Name" type="text" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address" type="email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            type="password" placeholder="Password" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">Verification Method</label>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${form.method === 'link' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                <input type="radio" name="method" value="link" checked={form.method === "link"} onChange={(e) => setForm({ ...form, method: e.target.value })} className="hidden" />
                <span className="text-sm font-medium">Email Link</span>
              </label>

              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${form.method === 'otp' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                <input type="radio" name="method" value="otp" checked={form.method === "otp"} onChange={(e) => setForm({ ...form, method: e.target.value })} className="hidden" />
                <span className="text-sm font-medium">OTP Code</span>
              </label>
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className={`w-full mt-6 font-bold py-3 rounded-lg transition-all duration-200 text-white shadow-lg flex justify-center items-center gap-2
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>}
          {loading ? "Registering..." : "Register"}
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}