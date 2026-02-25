import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function VerifyLink() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const hasCalled = useRef(false); // Prevents double-calling in Strict Mode

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    axios
      .get(`/api/verify/${token}`, { withCredentials: true })
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message);
        // Automatically redirect to dashboard after 3 seconds
        setTimeout(() => navigate("/dashboard"), 3000);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed or already used.");
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-gray-200">
        
        {/* --- STATE: VERIFYING --- */}
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold text-gray-800">Verifying...</h2>
            <p className="text-gray-500">Please wait while we secure your account.</p>
          </div>
        )}

        {/* --- STATE: SUCCESS --- */}
        {status === "success" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Redirecting to dashboard in 3 seconds...</p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Go to Dashboard Now
            </button>
          </div>
        )}

        {/* --- STATE: ERROR --- */}
        {status === "error" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
            <p className="text-gray-600">{message}</p>
            <div className="pt-4 flex flex-col gap-3">
              <Link 
                to="/login"
                className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-black transition"
              >
                Back to Login
              </Link>
              <Link to="/" className="text-blue-600 text-sm hover:underline">
                Try Registering Again
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}