import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const ImageSelector = ({ image, setImage, handleImageRemove }) => {
    const inputRef = useRef(null)
    const [ previewUrl, setPreviewUrl ] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file){
            setImage(file);
        }
        else{
            setImage(null);
        }
    }
    const onChooseFile = () => {
        inputRef.current.click()
    }
    const handleRemoveImg = () => {
        setImage("")
        handleImageRemove()
    }
    useEffect (() => {
        if (typeof image === 'string'){
            setPreviewUrl(image);
        } else if (image) {
            setPreviewUrl(URL.createObjectURL(image));
        } else {
            setPreviewUrl(null);
        }
        return () => {
            if (previewUrl && typeof previewUrl === 'string' && !image){
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [image]);

    return (
    <div>
      <input type="file"
      accept='image/*'
      ref={inputRef}
      onChange={handleImageChange}
      className='hidden'
       />
       {!image ? (<button className='w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50'
       onClick={() => onChooseFile()}>
        <div className='w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100'>
            <FaRegFileImage className="text-xl text-cyan-500"/>
        </div>
        <p className='text-sm text-slate-500'>Browse image file</p>
       </button>) : (
        <div className='w-full relative'>
            <img src={previewUrl} alt="Selected Image" className='w-full h-[300px] rounded-lg object-cover'/>
            <button className='btn-small hover:bg-red-500 bg-red-300 text-white top-2 right-2 absolute'
            onClick={handleRemoveImg}>
                <MdDeleteOutline className="text-lg"/>
            </button>
        </div>
        )
       }
    </div>
  )
}

export default ImageSelector
