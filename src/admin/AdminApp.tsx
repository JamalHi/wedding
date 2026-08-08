import { useState } from 'react';
import LoginScreen from './LoginScreen';
import Dashboard from './Dashboard';
import { getAccessToken, clearTokens } from './api';

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => !!getAccessToken());

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <Dashboard
      onAuthError={() => {
        clearTokens();
        setAuthed(false);
      }}
    />
  );
}
