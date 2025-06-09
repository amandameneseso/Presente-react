// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Clouds from '../components/Clouds';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../styles/auth.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      setError('Falha ao fazer login com Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Clouds />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.backButtonContainer}>
            <button 
              onClick={() => navigate('/')} 
              className={styles.backButton}
              aria-label="Voltar"
            >
              <FaArrowLeft /> <span>Voltar</span>
            </button>
          </div>
          <h2>Login</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className={styles.authButton}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className={styles.divider}>ou</div>
          
          <button 
            className={styles.googleButton} 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Entrar com Google
          </button>
          
          <div className={styles.authLinks}>
            <p>
              Não tem uma conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
