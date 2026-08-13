import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

export default function Login() {
  const { loginWithGoogle, user, loading } = useAuthStore();

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ff4e00 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 text-[#ffffff80] hover:text-[#ff4e00] transition-colors z-20 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#ff4e00] flex items-center justify-center shadow-[0_0_40px_rgba(255,78,0,0.4)]">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-black tracking-tighter uppercase text-white">
          Sign in to Clothora
        </h2>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-[#ff4e00] font-bold">
          Streetwear & Anime Apparel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#111] py-8 px-4 sm:px-10 border border-[#ffffff15] shadow-2xl">
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-[#ffffff15] text-xs font-bold uppercase tracking-widest text-white bg-[#1a1a1a] hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-4 h-4 mr-3"
            />
            {loading ? 'Authenticating...' : 'Sign in with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
