import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../screens_CSS/auth.css';

const Login = ({ setIsAuthenticated }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", {
        userName: userName,
        password: password
      });

      if (response.data) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Giriş başarısız!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Kullanıcı Adı:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Parola:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Giriş Yap</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="auth-link">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;