import React, { useState } from 'react';
import { authService } from '../services/auth';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLoginSuccess, onNavigateToRegister }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await authService.login({ username, password });
      onLoginSuccess();
    } catch (err: any) {
      if (err && typeof err === 'object') {
        setErrors(err);
      } else {
        setErrors({ message: 'An unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {errors.message && (
        <div className="error-banner">
          {errors.message}
        </div>
      )}

      {errors.non_field_errors && (
        <div className="error-banner">
          {Array.isArray(errors.non_field_errors)
            ? errors.non_field_errors.join(' ')
            : errors.non_field_errors}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          {errors.username && (
            <span className="field-error">
              {Array.isArray(errors.username) ? errors.username.join(' ') : errors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          {errors.password && (
            <span className="field-error">
              {Array.isArray(errors.password) ? errors.password.join(' ') : errors.password}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-redirect">
        <span>Don't have an account? </span>
        <button type="button" onClick={onNavigateToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
