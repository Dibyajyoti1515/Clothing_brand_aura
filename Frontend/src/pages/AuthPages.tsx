import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authApi } from '@/api/services';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      console.log(res);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-ink/40 flex flex-col justify-end p-12">
          <span className="font-display text-4xl font-semibold tracking-[0.15em] text-sand-50 mb-4">AURA</span>
          <p className="font-body text-sand-300 max-w-xs leading-relaxed">
            "Style is a way to say who you are without having to speak."
          </p>
          <p className="font-mono text-xs text-sand-400 mt-2">— Rachel Zoe</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-10">
            <Link to="/" className="font-display text-2xl tracking-[0.15em] text-ink lg:hidden">AURA</Link>
            <h1 className="font-display text-3xl text-ink mt-6 lg:mt-0">Welcome back</h1>
            <p className="font-body text-sm text-ink-400 mt-1.5">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-8 text-ink-300 hover:text-ink transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Sign In <ArrowRight size={16} />
            </Button>
          </form>

          <p className="font-body text-sm text-ink-400 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-clay hover:text-clay-dark font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.signup(form);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created! Welcome to AURA.');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 to-ink/40 flex flex-col justify-end p-12">
          <span className="font-display text-4xl font-semibold tracking-[0.15em] text-sand-50 mb-4">AURA</span>
          <p className="font-body text-sand-300 max-w-xs leading-relaxed">
            Join thousands who wear their truth every day.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-10">
            <Link to="/" className="font-display text-2xl tracking-[0.15em] text-ink lg:hidden">AURA</Link>
            <h1 className="font-display text-3xl text-ink mt-6 lg:mt-0">Create account</h1>
            <p className="font-body text-sm text-ink-400 mt-1.5">Join the AURA community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-8 text-ink-300 hover:text-ink transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              Create Account <ArrowRight size={16} />
            </Button>
          </form>

          <p className="font-body text-sm text-ink-400 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-clay hover:text-clay-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};