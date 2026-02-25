import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0); 
  
  // Toast State
  const [toast, setToast] = useState({ message: "", type: null });

  // Helper to show toasts
  const triggerToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: null }), 4000);
  };

  // Handle the countdown logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/verify-otp", form, { withCredentials: true });
      triggerToast(res.data.message || "Email verified!", "success");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      triggerToast(err.response?.data?.error || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const res = await axios.post("/api/resend-verification", { 
        email: form.email, 
        method: "otp" 
      });
      triggerToast(res.data.message || "OTP Resent!", "success");
      setTimer(60); 
    } catch (err) {
      triggerToast(err.response?.data?.error || "Resend failed", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans relative overflow-hidden">
      
      {/* --- TOAST NOTIFICATION --- */}
      {toast.type && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all duration-500 animate-in slide-in-from-top-full
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          <span className="font-bold">{toast.type === "success" ? "✓" : "✕"}</span>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
        <p className="text-gray-500 mb-6 text-sm">We've sent a 6-digit code to your email address.</p>

        <div className="space-y-4 text-left">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Confirm Email" 
            type="email"
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            required
          />
          
          <input 
            className="w-full p-3 border text-center text-2xl tracking-[0.5em] font-mono rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="000000" 
            maxLength="6" 
            value={form.otp} 
            onChange={(e) => setForm({ ...form, otp: e.target.value })} 
            required
          />
        </div>

        <button 
          disabled={loading}
          className={`w-full mt-6 font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 text-white
            ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
        >
          {loading && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>}
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4">
          <button 
            type="button" 
            onClick={handleResend} 
            disabled={resending || timer > 0}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline flex items-center justify-center gap-2 mx-auto"
          >
            {resending ? (
              "Sending..."
            ) : timer > 0 ? (
              <span className="flex items-center gap-1 text-gray-400">
                Resend in <span className="font-bold text-gray-600 w-5">{timer}s</span>
              </span>
            ) : (
              "Didn't get a code? Resend OTP"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}