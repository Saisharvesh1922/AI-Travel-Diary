import React, { useState } from 'react';
import PasswordInput from '../../components/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if(!password) {
      setError('Please enter your password');
      return;
    }
    setError("");

    //Login Api
    try {
      const response = await axiosInstance.post('/login', {
        email: email,
        password: password
      });
      if(response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard');
      }
  } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
    
  }

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-2/6 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
            <div>
              <h4 className='text-5xl font-semibold text-white leading-[58px]'>Capture Your <br/> Journey</h4>
              <p className='text-[15px] text-white leading-6 pr-7 mt-4'>Record your travel experience and memories in your personal journal</p>
            </div>
        </div>
        
        <div className='w-2/6 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7'>Login</h4>

            <input type="text" placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)} />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

            <button type='submit' className='btn-primary transition duration-300'>LOGIN</button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

          </form>
            <button type='submit' className='btn-primary btn-light transition duration-300' onClick={() => navigate('/signup')}>CREATE ACCOUNT</button>
        </div>

      </div>
      
    </div>
  )
}

export default Login;
