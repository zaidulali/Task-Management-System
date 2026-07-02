import React, { useState } from 'react';
import { authService } from '../services/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});

    const localErrors: { [key: string]: string[] } = {};
    if (password !== passwordConfirm) {
      localErrors.password_confirm = ['Passwords do not match.'];
    }
    if (password.length < 8) {
      localErrors.password = ['Password must be at least 8 characters long.'];
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setSuccess(true);
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
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
    <div className="register-container">
      <h2>Register Account</h2>
      
      {success && (
        <div className="success-banner">
          Registration successful! You can now log in.
        </div>
      )}

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
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          {errors.email && (
            <span className="field-error">
              {Array.isArray(errors.email) ? errors.email.join(' ') : errors.email}
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

        <div className="form-group">
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={loading}
            required
          />
          {errors.password_confirm && (
            <span className="field-error">
              {Array.isArray(errors.password_confirm)
                ? errors.password_confirm.join(' ')
                : errors.password_confirm}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
