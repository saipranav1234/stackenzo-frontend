import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", method: "link" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/register`, form, {
  withCredentials: true,
});
      
      // Capture the email and method before we clear the form
      const registeredEmail = form.email;
      const selectedMethod = form.method;

      alert(res.data.message);
      
      // Reset form
      setForm({ name: "", email: "", password: "", method: "link" });

      // Smart Routing
      if (selectedMethod === "otp") {
        // Pass the email to the OTP page via state
        navigate("/verify-otp", { state: { email: registeredEmail } });
      } else {
        // For link method, take them to login
        navigate("/login");
      }
      
    } catch (err) {
      alert(err.response?.data?.error || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-sans">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Full Name" 
            type="text" 
            name="name"
            autoComplete="name"
            required
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address" 
            type="email" 
            name="email"
            autoComplete="email"
            required
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            type="password" 
            placeholder="Password"
            name="password"
            autoComplete="new-password"
            required
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Verification Method</label>
            <select 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={form.method} 
              onChange={(e) => setForm({ ...form, method: e.target.value })}
            >
              <option value="link">Verification Link (Email)</option>
              <option value="otp">OTP (6-Digit Code)</option>
            </select>
          </div>
        </div>

        <button 
          disabled={loading}
          className={`w-full mt-6 font-bold py-3 rounded-lg transition-all duration-200 text-white shadow-lg flex justify-center items-center gap-2
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>}
          {loading ? "Creating Account..." : "Register"}
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}