import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../screens_css/auth.css';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form gönderiliyor...'); // Debug için log

    // Basit validation
    if (userName.length < 3) {
      setMessage("Kullanıcı adı en az 3 karakter olmalıdır!");
      return;
    }
    if (password.length < 6) {
      setMessage("Parola en az 6 karakter olmalıdır!");
      return;
    }

    try {
      const userData = {
        userName: userName,
        password: password
      };
      
      console.log('API isteği gönderiliyor...', userData);
      
      const response = await axios.post("http://localhost:8081/api/auth/register", userData);

      console.log('API yanıtı:', response.data);

      if (response.data) {
        setMessage("✅ Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Hata detayı:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setMessage("❌ Sunucuya bağlanılamadı! Lütfen sunucunun çalıştığından emin olun.");
      } else if (error.response?.status === 400) {
        setMessage("❌ " + (error.response.data.message || "Geçersiz kullanıcı bilgileri"));
      } else if (error.response?.status === 409) {
        setMessage("❌ Bu kullanıcı adı zaten kullanılıyor!");
      } else {
        setMessage("❌ Kayıt işlemi başarısız: " + (error.message || "Bilinmeyen hata"));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Kayıt Ol</h2>
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
          <button type="submit">Kayıt Ol</button>
        </form>
        {message && (
          <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <p className="auth-link">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 