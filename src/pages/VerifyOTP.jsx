import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email || "", otp: "" });
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0); // Cooldown timer state

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
    try {
      const res = await axios.post("/api/verify-otp", form, { withCredentials: true });
      alert(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return; // Guard clause

    setResending(true);
    try {
      const res = await axios.post("/api/resend-verification", { 
        email: form.email, 
        method: "otp" 
      });
      alert(res.data.message);
      setTimer(60); // Start 1-minute cooldown
    } catch (err) {
      alert(err.response?.data?.error || "Resend failed");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
        <p className="text-gray-500 mb-6">We've sent a 6-digit code to your email address.</p>

        <div className="space-y-4 text-left">
          <input 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Confirm Email" 
            type="email"
            autoComplete="email"
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          
          <input 
            className="w-full p-3 border text-center text-2xl tracking-[0.5em] font-mono rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="000000" 
            maxLength="6" 
            value={form.otp} 
            onChange={(e) => setForm({ ...form, otp: e.target.value })} 
          />
        </div>

        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95">
          Verify OTP
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