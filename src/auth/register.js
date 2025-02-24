import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../screens_css/auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "İsim gereklidir";
    if (!formData.surname) newErrors.surname = "Soyisim gereklidir";
    if (!formData.email) newErrors.email = "Email gereklidir";
    if (!formData.password) newErrors.password = "Şifre gereklidir";
    if (!formData.phone) newErrors.phone = "Telefon gereklidir";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/register", formData);
      navigate('/login', { 
        state: { 
          message: 'Kayıt başarılı! Lütfen giriş yapın.',
          type: 'success'
        }
      });
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Hesap Oluştur</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">İsim</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="surname">Soyisim</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className={errors.surname ? 'error' : ''}
              />
              {errors.surname && <span className="error-message">{errors.surname}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Kayıt Yapılıyor...
              </>
            ) : (
              'Kayıt Ol'
            )}
          </button>

          <div className="auth-links">
            <p>
              Zaten hesabınız var mı?{' '}
              <span onClick={() => navigate('/login')} className="link">
                Giriş Yap
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;