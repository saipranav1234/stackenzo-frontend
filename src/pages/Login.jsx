import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize email from redirect state if available
  const [form, setForm] = useState({ 
    email: location.state?.email || "", 
    password: "" 
  });
  
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  // States for button and timer
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Helper to show toasts
  const triggerToast = (msg, type) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: "", type: null }), 4000);
  };

  // Timer logic
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
    setIsLoggingIn(true);
    try {
      const res = await axios.post("/api/login", form, { withCredentials: true });
      triggerToast(res.data.message || "Login Successful!", "success");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error";
      if (errorMsg === "Account not verified") {
        setShowModal(true);
      } else {
        triggerToast(errorMsg, "error");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const resend = async () => {
    if (resendTimer > 0) return; 
    setIsResending(true);
    try {
      const res = await axios.post("/api/resend-verification", { 
        email: form.email, 
        method: "link" 
      });
      triggerToast(res.data.message || "Link sent!", "success");
      setResendTimer(60); 
    } catch (err) {
      triggerToast(err.response?.data?.error || "Resend failed", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans text-gray-900 relative overflow-hidden">
      
      {/* --- TOAST NOTIFICATION --- */}
      {toast.type && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl transition-all duration-500 animate-in slide-in-from-top-full
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          <span className="font-bold">{toast.type === "success" ? "✓" : "✕"}</span>
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* --- Main Login Form --- */}
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

        <div className="space-y-4">
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={isLoggingIn}
          className={`w-full mt-6 font-bold py-3 rounded-lg transition-all duration-200 shadow-md text-white flex justify-center items-center gap-2
            ${isLoggingIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoggingIn && <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>}
          {isLoggingIn ? "Authenticating..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Create account
          </Link>
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
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Required</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Check <b>{form.email}</b> or click below to resend.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate("/verify-otp", { state: { email: form.email } })}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Verify via OTP
                </button>
                
                <button 
                  onClick={resend}
                  disabled={isResending || resendTimer > 0}
                  className={`w-full py-2.5 rounded-lg font-semibold transition border flex justify-center items-center gap-2
                    ${(isResending || resendTimer > 0) 
                      ? 'bg-gray-100 text-gray-400 border-gray-200' 
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'}`}
                >
                  {isResending ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Link"}
                </button>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-gray-50 text-gray-500 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition mt-2">
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