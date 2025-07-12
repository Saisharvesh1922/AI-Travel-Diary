import React, { useState, useEffect } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose, MdDelete } from "react-icons/md";
import DateSelector from "../../components/DateSelector"
import TagsInput from "../../components/TagsInput"
import ImageSelector from "../../components/ImageSelector"
import axiosInstance from "../../utils/axiosinstance";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";
import moment from "moment";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {

    //add travel story
    const addTravelStory = async () => {
      try{
        let Url = "";
        if(imageUrl) {
          const imgUploadRes = await uploadImage(imageUrl);
          Url = imgUploadRes.imgUrl;
        }
        const response = await axiosInstance.post("/add-travel-story", {
          title,
          story,
          visitedLocation,
          imgUrl: Url || "",
          visitedDate: visitedDate ? String(moment(visitedDate).valueOf()) : String(moment().valueOf())
        })
        if(response.data){
          toast.success("Story added successfully")
          getAllTravelStories();
          onClose();
        }
      }catch(error){
        console.log(error)
      }
      }

    //update travel story
    const updateTravelStory = async () => {
      try{
        let imgUrl = "";
        let postData = {
            title,
            story,
            visitedLocation,
            imgUrl: storyInfo.imgUrl || "",
            visitedDate: visitedDate ? String(moment(visitedDate).valueOf()) : String(moment().valueOf())
          }
          console.log(imageUrl)
        if (typeof imageUrl === "object") {
          const imgUploadRes = await uploadImage(imageUrl);
          imgUrl = imgUploadRes.imgUrl || "";
          console.log(imgUrl)

          postData = {
            ...postData,
            imgUrl: imgUrl
          }}
          console.log(imgUrl)
        
        const response = await axiosInstance.put("/edit-story/" + storyInfo._id, postData)
        if(response.data){
          toast.success("Story updated successfully")
          getAllTravelStories();
          onClose();
        }
      }catch(error){
        console.log(error)
      }
    }

    //handle delete storyImage
    const handleDeleteStoryImg = async () => {
      console.log(storyInfo.imgUrl)
      if(storyInfo.imageUrl !== "http://localhost:8000/uploads/default.png"){

        const deleteImgRes = await axiosInstance.delete("/delete-image", {
          params: {
            imgUrl: storyInfo.imgUrl,
          }
        })
        if (deleteImgRes.data) {
          try{
          let imgUrl = "";
          let postData = {
              title,
              story,
              visitedLocation,
              imgUrl: storyInfo.imgUrl || "",
              visitedDate: visitedDate ? String(moment(visitedDate).valueOf()) : String(moment().valueOf())
            }
            console.log(imageUrl)
          if (typeof imageUrl === "object") {
            const imgUploadRes = await uploadImage(imageUrl);
            imgUrl = imgUploadRes.imgUrl || "";
            console.log(imgUrl)
  
            postData = {
              ...postData,
              imgUrl: imgUrl
            }}
            console.log(imgUrl)
          
          const response = await axiosInstance.put("/edit-story/" + storyInfo._id, postData)
          if(response.data){
            toast.success("Story updated successfully")
            getAllTravelStories();
            onClose();
          }
        }catch(error){
          console.log(error)
        }
        }
      }
    }


    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
    const [title, setTitle] = useState(storyInfo?.title ||"")
    const [story, setStory] = useState(storyInfo?.story || "")
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocations || [])
    const [imageUrl, setImageUrl] = useState(storyInfo?.imgUrl || "")
    const[error, setError] = useState(null)

    useEffect(() => {
  if (storyInfo) {
    setVisitedDate(storyInfo.visitedDate || null);
    setTitle(storyInfo.title || "");
    setStory(storyInfo.story || "");
    setVisitedLocation(storyInfo.visitedLocations || []);
    setImageUrl(storyInfo.imgUrl || "");
  }
}, [storyInfo]);

    
    const handleAddOrUpdateClick = async () => {
      
      if(!title){
        setError("Please enter title") 
      }
      if(!story){
        setError("Please enter story")
      }
      
      if(type === 'edit'){
        updateTravelStory()
      }
      else{
        addTravelStory()
      }
    }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 roundedrounded-l-lg">
          {type === "add" ? (
          <button className="btn-small" onClick={handleAddOrUpdateClick}>
            <MdAdd className="text-lg" />
            ADD STORY
          </button>
           ) : (
            <>
            <button className="btn-small" onClick={handleAddOrUpdateClick}>
            <MdUpdate className="text-lg" />
            UPDATE STORY
           </button>
            </>
            
        )}
          <button className="btn-small text-slate-400" onClick={onClose}>
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>
          {error && <p className="text-red-500 text-right">{error}</p>}
          <div>
            <div className="flex-1 flex flex-col gap-2 pt-4">
                <label className="input-label">TITLE</label>
                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" className="text-2xl text-slate-950 outline-none" placeholder="A Day at..." />
            </div>
            <div>
              <DateSelector date={visitedDate} setDate={setVisitedDate}/>
            </div>
            <div>
              <ImageSelector image={imageUrl} setImage={setImageUrl} handleImageRemove={handleDeleteStoryImg}/>
            </div>
            <div className="flex-1 flex flex-col gap-2 pt-6">
                <label className="input-label">STORY</label>
                <textarea onChange={(e) => setStory(e.target.value)} value={story} type="text" className="text-md border-slate-200 outline-none" rows={10} placeholder="Your Story" />
            </div>
            <div>
              <TagsInput tags={visitedLocation} setTags={setVisitedLocation}/>
            </div>
          </div>
    </div>
  );
};

export default AddEditTravelStory;
