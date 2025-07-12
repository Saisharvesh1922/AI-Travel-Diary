import React, {useState} from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder}) => {
    const [isShowPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!isShowPassword);
    }

  return (
    <div className='flex items-center px-5 rounded mb-3 bg-cyan-600/5'>
      <input value={value} onChange={onChange} placeholder={placeholder || 'Password'} className='w-full text-sm bg-transparent rounded py-3 mr-3 outline-none' type={isShowPassword ? 'text' : 'password'} />
      {isShowPassword ? 
      <FaEye size={22} className='text-primary cursor-pointer' onClick={() => toggleShowPassword()}/> :
      <FaEyeSlash size={22} className='text-slate cursor-pointer' onClick={() => toggleShowPassword()}/>}
    </div>
  )
}

export default PasswordInput
