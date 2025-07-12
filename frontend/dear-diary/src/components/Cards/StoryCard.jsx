import React from 'react'
import moment from 'moment/moment';
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import axiosInstance from '../../utils/axiosinstance';

const StoryCard = ({ 
    imgUrl,
    title,
    story,
    date,
    visitedLocations,
    isFavorite,
    onEdit,
    onClick,
    onFavouriteClick
    }) => {

  return (
    <div className='border border-rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>
        <img src={imgUrl} alt={title} className='w-full h-60 object-cover rounded-lg' />
        <button className='flex absolute top-4 right-4 w-10 h-10 items-center justify-center rounded-lg border border-white/30 text-white bg-white/40' onClick={onFavouriteClick}>
            <FaHeart className={`icon-btn ${isFavorite ? 'text-red-500' : 'text-white'}`} />
        </button>

        <div onClick={onClick} className='p-6 gap-2'>
           <div className=''>
            <div>
                <h2 className='font-sm font-medium'>{title}</h2>
                <p className='text-sm text-slate-500 mt-1'>{moment(date).format('Do MMM YYYY')}</p>
                <p className='text-sm text-slate-500 mt-3'>{story?.slice(0, 60)}</p>
            </div>
            <div className='inline-flex items-center text-[13px] gap-2 mt-2 bg-cyan-100 text-cyan-600 rounded px-2'>
                <FaLocationDot/>{visitedLocations && visitedLocations.map((item, index) => 
                    visitedLocations.length == index + 1 ? `${item}` : `${item}`
                
                )}

            </div>
           </div>
        </div>
      
      
    </div>
  )
}

export default StoryCard
