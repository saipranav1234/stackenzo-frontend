import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", method: "link" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/register", form, { withCredentials: true });
      
      const registeredEmail = form.email;
      const selectedMethod = form.method;

      alert(res.data.message);
      
      // Smart Routing for new registrations
      if (selectedMethod === "otp") {
        navigate("/verify-otp", { state: { email: registeredEmail } });
      } else {
        navigate("/", { state: { email: registeredEmail } });
      }
      
    }  catch (err) {
  const errorResponse = err.response?.data?.error || "";

  // Convert to lowercase to avoid Case-Sensitivity issues
  const lowError = errorResponse.toLowerCase();

  if (lowError.includes("account_unverified") || lowError.includes("already registered")) {
    alert("This email is already registered. Please login to continue.");
    navigate("/", { state: { email: form.email } });
  } else {
    alert(errorResponse || "Error during registration");
  }
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Full Name" type="text" name="name" autoComplete="name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address" type="email" name="email" autoComplete="email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            type="password" name="password" autoComplete="new-password" placeholder="Password" required
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