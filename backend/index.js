const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const config = require('./config.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const { authenticateToken } = require('./utilities');

const upload = require('./multer'); 
const path = require('path');
const fs = require('fs');

// Importing models
const User = require('./models/user.model');
const TravelStory = require('./models/travel-story.model');

mongoose.connect(config.connectionString)


const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'aasets')));

//Create Account
app.post('/create-account', async (req, res) => {
    const {fullName, email, password} = req.body;
    if ( !fullName || !email || !password){
        return res.status(400).json({error: true, message: "All fields are required"});
    }
    
    const isUser = await User.findOne({email});
    if (isUser){
        return res.status(400).json({message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        fullName,
        email,
        password: hashedPassword
    })
    await user.save();

    const accessToken = jwt.sign({userId: user.id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: '72h'
        }
    );

    return res.status(201).json({
        error: false,
        message: "User created successfully",
        accessToken,
        user: {
            fullName: user.fullName,
            email: user.email,
        }
    })
})

//Login
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({error: true, message: "All fields are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error: true, message: "User does not exist"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({error: true, message: "Invalid password"});
    }

    const accessToken = jwt.sign({userId: user.id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {
        expiresIn: '72h'
        }
    );

    return res.status(200).json({
        error: false,
        message: "Login successful",
        accessToken,
        user: {
            fullName: user.fullName,
            email: user.email,
        }
    })
}
)

//Get User
app.get('/user', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const isUser = await User.findById(userId);
    if (!isUser) {
        return res.status(401).json({error: true, message: "User not found"});
    }
    return res.json({
        user: isUser,
        message: "User found",
    });
})

//Image Upload
app.post('/image-upload', upload.single("image"), async (req, res) =>{
    try{
        if (!req.file) {
            return res.status(400).json({error: true, message: "No file uploaded"});
        }
    
        const imgUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        console.log(imgUrl)
        return res.status(200).json({
            imgUrl
        });
       } catch (error) {
        return res.status(400).json({error: true, message: error.message});
      }
});

//Delete Image
app.delete('/delete-image', async (req, res) =>{
    const { imgUrl } = req.query;
    if(!imgUrl) {
        return res.status(400).json({error: true, message: "Image URL is required"});
    }
    const fileName = path.basename(imgUrl);
    const filePath = path.join(__dirname, 'uploads', fileName);
    console.log(filePath)
    try{
    if(fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return res.status(200).json({message: "Image deleted successfully"});
    }
    else{
        return res.status(400).json({error: true, message: "Image not found"});
    }
} catch (error) {
    return res.status(400).json({error: true, message: "Internal server error"});
    }

});

//Add Travel Story
app.post('/add-travel-story',authenticateToken, async (req, res) => {
    console.log(req.body)
    const { title, story, visitedLocation, imgUrl, visitedDate } = req.body;
    const { userId } = req.user; 
    const DEFAULT_IMAGE_URL = "http://localhost:8000/uploads/default.png";
    
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({error: true, message: "All fields are required"});
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try {
        if (!imgUrl) {
            const newFileName = Date.now() + '_default.png';
            const UPLOADS_DIR = __dirname + '/uploads';
            const DEFAULT_IMAGE_PATH = __dirname + '/assets/default.png'
            const newFilePath = path.join(UPLOADS_DIR, newFileName);

            // Ensure uploads folder exists
            if (!fs.existsSync(UPLOADS_DIR)) {
                fs.mkdirSync(UPLOADS_DIR, { recursive: true });
            }

            // Copy default image to uploads/
            fs.copyFileSync(DEFAULT_IMAGE_PATH, newFilePath);

            // Generate new URL for copied image
            finalImgUrl = `http://localhost:8000/uploads/${newFileName}`;
            console.log(finalImgUrl)
        }
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocations: visitedLocation,
            imgUrl: imgUrl || finalImgUrl,
            visitedDate: parsedVisitedDate,
            userId
        });
        await travelStory.save();
        return res.status(201).json({message: "Added successfully", title: travelStory.title});
    } catch (error) {
        console.error(error);
        return res.status(400).json({error: true, message: error.message});
    }
});

//Show Travel Stories
app.get('/get-all-stories', authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try{
    const travelStories  = await TravelStory.find({userId}).sort({isFavourite: -1});
    return res.status(200).json({
        error: false,
        message: "Travel stories fetched successfully",
        travelStories
    });
    } catch (error) {
        console.error(error);
        return res.status(400).json({error: true, message: error.message});
    }
})

//edit Travel Story
app.put('/edit-story/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imgUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({error: true, message: "All fields are required"});
    }
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});
        if(!travelStory) {
            return res.status(404).json({error: true, message: "Travel story not found"});
        }
        const defaultImgUrl = "./assets/default.png";
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocations = visitedLocation;
        travelStory.imgUrl = imgUrl || defaultImgUrl;
        travelStory.visitedDate = parsedVisitedDate;
        await travelStory.save();
        res.status(200).json({
            error: false,
            message: "Travel story updated successfully",
            travelStory
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({error: true, message: error.message});
    }
});

//Delete Travel Story
app.delete('/delete-story/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});
        if(!travelStory) {
            return res.status(404).json({error: true, message: "Travel story not found"});
        }
        await TravelStory.deleteOne({_id: id, userId: userId});
        res.status(200).json({message: "Travel story deleted successfully"});

        //Unlink image
        const imgUrl = travelStory.imgUrl;
        if (imgUrl && imgUrl !== "./assets/default.png") {
            const fileName = path.basename(imgUrl);
            const filePath = path.join(__dirname, 'uploads', fileName);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: true, message: error.message});
    }

});

//Favourite Travel Story
app.put('/update-is-favourite/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});
        if(!travelStory) {
            return res.status(404).json({error: true, message: "Travel story not found"});
        }
        const isFavourite = !travelStory.isFavourite;
        travelStory.isFavourite = isFavourite;
        await travelStory.save();
        res.status(200).json({
            error: false,
            message: isFavourite ? "Travel story marked as favourite" : "Travel story removed from favourites",
            isFavourite
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({error: true, message: error.message});
    }
});

//Search Travel Stories
app.get('/search', authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(400).json({error: true, message: "Query is required"});
    }
    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { story: { $regex: query, $options: 'i' } },
                { visitedLocations: { $regex: query, $options: 'i' } }
            ]
        }).sort({isFavourite: -1});
        res.status(200).json({
            stories: searchResults,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({error: true, message: error.message});
    }
});

//Filter Travel Stories
app.get('/travel-stories/filter', authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;
    
    try {
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const searchResults = await TravelStory.find({
            userId: userId,
            visitedDate: {
                $gte: start,
                $lte: end
            }
        }).sort({isFavourite: -1});

        res.status(200).json({
            stories: searchResults,
        })  
    } catch (error) {
        console.error(error);
        res.status(400).json({error: true, message: "Invalid date format"});
    }
});

//Port configuration
app.listen(8000, () => {
    console.log('Server is running on port 3000');
})
module.exports = app;