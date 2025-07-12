import React, {useState} from 'react'
import { MdAdd, MdClose } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";

const TagsInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('')
    const addNewTags = () => {
        if(inputValue && inputValue.trim() !== "")
        {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }

    }
    const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag))

    }
  return (
    <div>
        {tags.length > 0 && 
            <div className='flex items-center gap-2 flex-wrap mt-2'>
                {tags.map((tag, index) => (
                    <span key={index} className='flex gap-1 bg-cyan-200/50 rounded-lg p-1 text-primary text-sm'>
                        <FaLocationDot/>{tag}
                    <button onClick={() => {handleRemoveTag(tag)}}>
                        <MdClose />
                    </button>
                    </span>
                ))}
            </div>
        }
        <div className="items-center flex gap-4 mt-3">
            <input className="outline-none background-transparent text-sm border rounded px-3 py-2" type="text" placeholder="Add location" value={inputValue || ""} onChange={(e) => setInputValue(e.target.value)} />
            <button className='bg-cyan-200/50 items-center p-3 rounded-full' onClick={addNewTags}><MdAdd/></button>
        </div>
      
    </div>
  )
}

export default TagsInput
