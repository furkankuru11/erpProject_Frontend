import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basit validation
    if (userName.length < 3) {
      setMessage("❌ Kullanıcı adı en az 3 karakter olmalıdır!");
      return;
    }
    if (password.length < 6) {
      setMessage("❌ Parola en az 6 karakter olmalıdır!");
      return;
    }

    try {
      console.log('Giriş denemesi yapılıyor...', { userName, password });

      const response = await axios.post("http://localhost:8081/api/auth/login", {
        userName: userName,
        password: password
      });

      console.log('Backend yanıtı:', response);
      console.log('Yanıt verisi:', response.data);

      // Backend'den gelen yanıtı kontrol et
      if (response.data && response.status === 200) {
        setMessage("✅ Giriş başarılı! Yönlendiriliyorsunuz...");
        
        // Token varsa sakla
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        localStorage.setItem('userName', userName);
        setIsAuthenticated(true);
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage("❌ Beklenmeyen yanıt formatı");
        console.warn('Beklenmeyen yanıt:', response);
      }
    } catch (error) {
      console.error('Login hatası:', error);
      console.error('Hata detayı:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.code === 'ERR_NETWORK') {
        setMessage("❌ Sunucuya bağlanılamadı! Sunucu çalışıyor mu?");
      } else if (error.response?.status === 401) {
        setMessage("❌ " + (error.response.data.message || "Kullanıcı adı veya şifre hatalı!"));
      } else if (error.response?.status === 404) {
        setMessage("❌ " + (error.response.data.message || "Kullanıcı bulunamadı!"));
      } else {
        setMessage("❌ Giriş başarısız: " + (error.response?.data?.message || error.message));
      }
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
              minLength={3}
            />
          </div>
          <div className="form-group">
            <label>Parola:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit">Giriş Yap</button>
        </form>
        {message && (
          <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <p className="auth-link">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;