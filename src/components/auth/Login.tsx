import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { ShoppingBag, ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, user, loading } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        toast.success('Successfully logged in');
      } else {
        await signupWithEmail(email, password, displayName);
        toast.success('Account created successfully');
      }
    } catch (error: any) {
      const message = error.message || 'Authentication failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors z-20 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Store</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary flex items-center justify-center shadow-[4px_4px_0px_#5c1900] border-2 border-surface-bright">
            <ShoppingBag className="w-8 h-8 text-on-primary" />
          </div>
        </div>
        <h2 className="mt-8 text-center text-4xl font-black tracking-tighter uppercase text-on-surface">
          {isLogin ? 'Sign in to Clothora' : 'Join Clothora'}
        </h2>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-primary font-bold">
          Streetwear & Anime Apparel
        </p>
      </div>

      <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-surface-container-low py-8 px-4 sm:px-10 border-2 border-surface-bright shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface mb-2">Display Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-on-surface-variant" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border-2 border-surface-bright bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                    placeholder="Shinobi"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-surface-bright bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                  placeholder="ninja@hiddenleaf.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-surface-bright bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-0 focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border-2 border-primary text-xs font-bold uppercase tracking-widest text-on-primary bg-primary hover:bg-[#e64600] transition-all hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_#5c1900] hover:shadow-[2px_2px_0px_#5c1900] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-bright" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                <span className="px-2 bg-surface-container-low text-on-surface-variant">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={loginWithGoogle}
                disabled={loading}
                type="button"
                className="w-full flex justify-center py-4 px-4 border-2 border-surface-bright text-xs font-bold uppercase tracking-widest text-on-surface bg-surface-container-high hover:bg-primary hover:text-on-primary hover:border-primary transition-all hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_#5c1900] hover:shadow-[2px_2px_0px_#5c1900] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-4 h-4 mr-3"
                />
                Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
