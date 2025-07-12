import React from 'react'
import Navbar from '../../components/Navbar'
import StoryCard from '../../components/Cards/StoryCard';
import ViewTravelStory from './ViewTravelStory';
import AddEditTravelStory from './AddEditTravelStory';
import axiosInstance from '../../utils/axiosinstance';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DayPicker } from 'react-day-picker';

const Home = () => {

    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({form: null, to:null})
    const [filterType, setFilterType] = useState('');
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isOpen: false,
        type: "add",
        data: null
    });
    
    const [openViewModal, setOpenViewModal] = useState({
        isOpen: false,
        data: null
    })

    const handleViewStory = ((data) => {
        setOpenViewModal({
            isOpen: true,
            data: data
    })})

    const handleEdit = ((data) => {
        setOpenAddEditModal({ isOpen: true, type: "edit", data: data })
})

    

    // Fetch user data from the server
    const fetchUserData = async () => {

    try{
        const response = await axiosInstance.get('/user')
        if (response.data && response.data.user)
            setUserInfo(response.data.user);
    }
    catch (error) {
        if(error.response.status === 401) {
            navigate('/login');
        }
    }};

    // Fetch all stories from the server
    const fetchAllStories = async () => {
        try {
            const response = await axiosInstance.get('/get-all-stories');
            if (response.data && response.data.travelStories) {
                setAllStories(response.data.travelStories);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    //Update isFavourite 
    const updateIsFavourite = async (story) => {
        const storyId = story._id;
        try {
            const response = await axiosInstance.put(`/update-is-favourite/${storyId}`);
            if (response.data) {
                toast.success("Story updated successfully");
                fetchAllStories(); 
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Delete Travel Story
    const deleteTravelStory = async (data) => {
        const storyId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-story/" + storyId);
            if (response.data && !response.data.error) {
                toast.error("Story Deleted Successfully");
                setOpenViewModal((prevState) => ({ ...prevState, isOpen: false }));
                fetchAllStories();
            }
        } catch (error) {
            console.error(error);
        }
    };

    //Search Story
    const onSearchStory = async (query) => {
        try {
            const response = await axiosInstance.get("/search", {
                params: {
                    query,
                },
            });
            if (response.data && response.data.stories) {
                setFilterType("search");
                setAllStories(response.data.stories);
            }
        }catch (error){
            console.log("An error occured")
        }
    }

    const handleClearSearch = () => {
        setFilterType('')
        fetchAllStories();
    }

    const filterStoriesByDate = async (range) => {
  console.log("Triggered");
  console.log("Received day:", range);

  const { from, to } = range;

  if (!from || !to) return; // wait until full range is selected

  const startDate = moment(from).startOf("day").valueOf();
  const endDate = moment(to).endOf("day").valueOf(); // should include all of 'to' day

  console.log("Start:", startDate, "End:", endDate);

  try {
    const response = await axiosInstance.get("/travel-stories/filter", {
      params: { startDate, endDate },
    });

    if (response.data?.stories) {
      setFilterType("date");
      setAllStories(response.data.stories);
    }
  } catch (error) {
    console.error("Error filtering by date:", error);
  }
};



    const handleDayClick = (day) => {
        setDateRange(day);
        filterStoriesByDate(day);
    }
    

    useEffect(() => {
        fetchUserData();
        fetchAllStories();
    }, []);

  return (
    <div>
        
        <Navbar userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}/>
        

        <div className='container mx-auto py-10 px-20'>
            <div className='flex gap-7'>
                <div className='flex-1'>
                    
                    { allStories && allStories.length > 0 ? (
                        <div className='grid grid-cols-2 gap-4'>
                        {allStories.map((story) => {
                            return(
                                <StoryCard key={story._id}
                                imgUrl={story.imgUrl}
                                title={story.title}
                                story={story.story}
                                date={story.visitedDate}
                                visitedLocations={story.visitedLocations}
                                isFavorite={story.isFavourite}
                                onEdit={() => handleEdit(story)}
                                onClick={() => handleViewStory(story)}
                                onFavouriteClick={() => updateIsFavourite(story)}
                                />
                            )
                     })}
                     </div>
                     ) : (
                     <p>No stories available</p>
                     )}
                </div>

                <div className='w-[320px]'>
                        <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
                        <div className='p-3'>
                            <DayPicker
                            captionLayout='dropdown-buttons'
                            mode="range"
                            selected={dateRange}
                            onSelect={handleDayClick}
                            pagedNavigation/>

                        </div>

                    </div>
                </div>
            </div>
        </div>

        
        <Modal
        isOpen={openAddEditModal.isOpen}
        onRequestClose={() => {}}
        style={{
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                zIndex: 999,
            },
        }}
        appElement={ document.getElementById('root')}
        className="model-box">
            <AddEditTravelStory
            type={openAddEditModal.type}
            storyInfo={openAddEditModal.data}
            onClose={() => {
                setOpenAddEditModal({ isOpen: false, type: "add", data: null });
            }}
            getAllTravelStories={fetchAllStories}
            />
        </Modal>

        <Modal
        isOpen={openViewModal.isOpen}
        onRequestClose={() => {}}
        style={{
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                zIndex: 999,
            },
        }}
        appElement={ document.getElementById('root')}
        className="model-box">
            <ViewTravelStory
            onClose={() => {
                setOpenViewModal({ isOpen: false, data: null });
            }}
            onEditClick={() => {
                setOpenViewModal({ isOpen: false, data: null });
                handleEdit(openViewModal.data || null)
            }}
            onDeleteClick={() => {deleteTravelStory(openViewModal.data || null)}}
            storyInfo={openViewModal.data || null}
            
            />
        </Modal>

        <button className='w-16 h-16 flex items-center justify-center fixed rounded-full right-4 bottom-4 bg-primary' onClick={() => setOpenAddEditModal({ isOpen: true, type: "add", data: null })}>
            <MdAdd className="text-[32px] text-white"/>

        </button>
        <ToastContainer autoClose={2000} position='top-center'/>
        
    </div>
  )
}

export default Home
