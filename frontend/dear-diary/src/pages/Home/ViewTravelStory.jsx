import React from 'react'
import moment from 'moment';
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose, MdDelete } from "react-icons/md";
import {GrMapLocation} from 'react-icons/gr'

const ViewTravelStory = ({storyInfo, onClose, onEditClick, onDeleteClick}) => {
    
  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 roundedrounded-l-lg">        
            <button className="btn-small" onClick={onEditClick}>
            <MdUpdate className="text-lg" />
            UPDATE STORY
            </button>
        
            <button className="btn-small btn-delete" onClick={onDeleteClick}>
            <MdDelete className="text-lg" />
            DELETE
            </button>
                    
            <button className="btn-small text-slate-400" onClick={onClose}>
            <MdClose className="text-xl" />
            </button>
            </div>
      </div> 
      {storyInfo &&
      <div>
        <div className='flex-1 flex flex-col gap-2 py-2'>
            <h1 className='text-2xl text-slate-950'>
                {storyInfo && storyInfo.title}
            </h1>

            <div className='items-center justify-between gap-3'>
                <span className='text-xs text-slate-500'>
                    {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                </span>

                <div className='inline-flex justify-end px-2 py-1 gap-2  bg-cyan-200/50 rounded text-primary text-[13px]'>
                    <GrMapLocation className="text-sm"/>
                    {storyInfo && storyInfo.visitedLocations.map((item, index) => 
                    storyInfo.visitedLocations.length == index+1 ? `${item}` : `${item}, `)}
                </div>

                <div>
                    {storyInfo && storyInfo.imgUrl ? (
                      <img className='w-full h-[300px] rounded-lg object-cover' src={storyInfo.imgUrl} />
                    ) : (
                      <img className='w-full h-[300px] rounded-lg object-cover' src="/default.jpg" />
                    )}
                </div>

                <div>
                    <div className="flex-1 flex flex-col gap-2 pt-6">
                    <label className="input-label">STORY</label>
                    <p className="text-md border-slate-200 outline-none" >{storyInfo.story}</p> 
                </div>

                </div>
            </div>
        </div>
      </div>}
    </div>
  )
}

export default ViewTravelStory
