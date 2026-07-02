import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import { authService } from './services/auth';

function App() {
  const [view, setView] = useState(() => {
    return localStorage.getItem('token') ? 'tasks' : 'login';
  });

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      localStorage.removeItem('token');
    }
    setView('login');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>TaskSphere</h1>
        {view === 'tasks' && (
          <button type="button" onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </header>

      <main className="app-main">
        {view === 'login' && (
          <Login
            onLoginSuccess={() => setView('tasks')}
            onNavigateToRegister={() => setView('register')}
          />
        )}

        {view === 'register' && (
          <div className="auth-wrapper">
            <Register />
            <div className="auth-redirect">
              <span>Already have an account? </span>
              <button type="button" onClick={() => setView('login')}>
                Login
              </button>
            </div>
          </div>
        )}

        {view === 'tasks' && <Tasks />}
      </main>
    </div>
  );
}

export default App;
