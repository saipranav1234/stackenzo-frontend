import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", method: "link" });
  
  // Modal & Resend States
  const [showModal, setShowModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Timer logic for Resend button
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/register", form, { withCredentials: true });
      
      const registeredEmail = form.email;
      const selectedMethod = form.method;

      alert(res.data.message);
      setForm({ name: "", email: "", password: "", method: "link" });

      if (selectedMethod === "otp") {
        navigate("/verify-otp", { state: { email: registeredEmail } });
      } else {
        navigate("/login");
      }
      
    } catch (err) {
      // Logic: If email exists but is not verified, show the modal
      if (err.response?.data?.error === "Email already registered" || err.response?.data?.error === "Account not verified") {
        setShowModal(true);
      } else {
        alert(err.response?.data?.error || "Error during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendTimer > 0) return;
    setIsResending(true);
    try {
      await axios.post("/api/resend-verification", { 
        email: form.email, 
        method: form.method 
      });
      alert("A fresh verification link/OTP has been sent!");
      setResendTimer(60);
    } catch (err) {
      alert(err.response?.data?.error || "Resend failed");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans text-gray-900">
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
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${form.method === 'link' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                <input type="radio" name="method" value="link" checked={form.method === "link"} onChange={(e) => setForm({ ...form, method: e.target.value })} className="hidden" />
                <span className="text-sm font-medium">Email Link</span>
              </label>

              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${form.method === 'otp' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-gray-50 border-gray-200'}`}>
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
          {loading ? "Creating..." : "Register"}
        </button>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </p>
      </form>

      {/* --- Verification Pending Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-amber-100 mb-4">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Account Unverified</h3>
              <p className="text-sm text-gray-500 mb-6">
                This email is already registered but needs verification.
              </p>
              
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/verify-otp", { state: { email: form.email } })} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Go to Verify Page
                </button>
                <button 
                  disabled={isResending || resendTimer > 0} 
                  onClick={resend} 
                  className={`w-full py-2.5 rounded-lg font-semibold border flex justify-center items-center gap-2
                    ${(isResending || resendTimer > 0) ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                >
                  {isResending ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Link/OTP"}
                </button>
                <button onClick={() => setShowModal(false)} className="w-full bg-gray-50 text-gray-500 py-2.5 rounded-lg font-semibold hover:bg-gray-100 mt-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}