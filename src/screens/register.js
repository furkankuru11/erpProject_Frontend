import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Kayıt isteği gönderiliyor...', {
      userName: username,
      password: password
    });

    // Basit validation
    if (username.length < 3) {
      setMessage("Kullanıcı adı en az 3 karakter olmalıdır!");
      return;
    }
    if (password.length < 6) {
      setMessage("Parola en az 6 karakter olmalıdır!");
      return;
    }

    try {
        const response = await axios.post("http://localhost:8081/api/users/save", {
            username,
            password
        });
      console.log('Sunucu yanıtı:', response.data);
      setMessage("✅ " + (response.data.message || "Kayıt başarılı!"));
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error('Hata detayı:', error.response || error);
      if (error.code === 'ERR_NETWORK') {
        setMessage("❌ Sunucuya bağlanılamadı! Sunucu çalışmıyor olabilir.");
      } else if (error.response?.status === 401) {
        setMessage("❌ Yetkilendirme hatası! Backend'de güvenlik ayarlarını kontrol edin.");
      } else if (error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Kayıt başarısız: " + error.message);
      }
    }
  };

  

  return (
    <div className="register-container">
      <h2 className="page-title">Kayıt Ol</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Kullanıcı Adı:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
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
        <button type="submit">Kayıt Ol</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
