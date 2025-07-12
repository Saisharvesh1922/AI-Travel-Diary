import React from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = ({userInfo}) => {

    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

  return (
    <div className='flex items-center gap-4'>
      <div className='rounded-full bg-slate-200 w-10 h-10 flex items-center justify-center font-bold font-medium text-slate-800'>
        {userInfo && <p>{userInfo?.fullName?.[0].toUpperCase()}</p>}
      </div>
      <div>
        {userInfo && <p className='font-sm'>{userInfo.fullName}</p>}
        <button onClick={Logout} className='underline text-slate-800'>logout</button>
      </div>
    </div>
  )
}

export default Profile
