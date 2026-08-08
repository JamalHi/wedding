import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { login } from './api';

export default function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
      onSuccess();
    } catch {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      dir="rtl"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, rgba(194,99,122,0.18), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(242,196,206,0.10), transparent 55%), var(--noir)',
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm p-8 space-y-6"
        style={{
          background: 'linear-gradient(135deg, rgba(242,196,206,0.06), rgba(194,99,122,0.03))',
          border: '1px solid rgba(242,196,206,0.2)',
          borderRadius: '20px',
          boxShadow: '0 30px 60px -20px rgba(24,13,16,0.6)',
        }}
      >
        <div className="text-center space-y-2">
          <div
            className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #c2637a, #7b3a4c)' }}
          >
            <Lock size={22} color="#fff5f7" />
          </div>
          <h1 className="text-2xl" style={{ fontFamily: 'Amiri, serif', color: 'var(--cream)' }}>
            لوحة التحكم
          </h1>
          <p className="text-sm" style={{ fontFamily: 'Tajawal, sans-serif', color: 'var(--muted)' }}>
            سجّل دخولك لعرض إحصائيات الحضور
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="rsvp-input w-full px-4 py-3 text-lg"
            style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '12px' }}
            autoFocus
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="rsvp-input w-full px-4 py-3 text-lg"
            style={{ fontFamily: 'Tajawal, sans-serif', borderRadius: '12px', direction: 'ltr', textAlign: 'right' }}
          />
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: '#ff8aa5', fontFamily: 'Tajawal, sans-serif' }}>
            {error}
          </p>
        )}

        <motion.button
          type="submit"
          disabled={busy}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #c2637a, #7b3a4c)',
            color: '#fff5f7',
            border: 'none',
            fontFamily: 'Tajawal, sans-serif',
            letterSpacing: '0.15em',
            borderRadius: '999px',
            boxShadow: '0 15px 35px -10px rgba(194,99,122,0.7)',
          }}
        >
          {busy ? 'جارٍ الدخول...' : 'دخول'}
        </motion.button>
      </motion.form>
    </div>
  );
}
