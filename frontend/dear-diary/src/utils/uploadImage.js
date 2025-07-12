import axiosInstance from "./axiosinstance";

const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    try{
        const response = await axiosInstance.post("/image-upload", formData, {
            headers: {
                "Content-Type":"multipart/form-data"
            }
        });
        console.log(response.data)
        return response.data
    }catch (error){
        throw error;
    }
}

export default uploadImage;