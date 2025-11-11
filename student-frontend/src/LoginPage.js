import React, { useState } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png'; 
function LoginPage({ setUser }) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const navigate = useNavigate();
  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');
    if (!recaptchaValue) {
      setLoginError('Please complete the captcha');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(loginForm.username);
        setLoginForm({ username: '', password: '' });
        setRecaptchaValue("");
        navigate('/home');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError('Network error');
    }
  };
  return (
    <div className="login-container">
      <img src={logo} alt="App Logo" style={{width: 80, margin: '0 auto 24px', display: 'block'}} />
      <div className="login-title">Student Portal Login</div>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          name="username"
          placeholder="Username"
          autoComplete="username"
          value={loginForm.username}
          onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={loginForm.password}
          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
          required
        />
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}  
          onChange={value => setRecaptchaValue(value)}
          style={{margin: '20px 0'}}
        />
        <button type="submit">Login</button>
        {loginError && <div className="login-error">{loginError}</div>}
      </form>
    </div>
  );
}
export default LoginPage;
