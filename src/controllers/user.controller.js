import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"


const registerUser = asyncHandler(
    async(req,res) => {
        //get the user details from the frontend
        //validation - 
        //check if the user already already exist
        //check for images
        //check for the avatar
        //upload them to cloudinary, check if the avatar is uploaded in the cloudinary
        //Create the user object - create entry in DB
        //remove the password and the referesh token filled
        //check for the user creation 
        //Return response
        const {fullName,email,username,password} = req.body
        console.log("email :",email)
        console.log("password :",password)

        if(
            [fullName,email,username,password].some(
                (field) => field?.trim() ===""
            )
        ){
            throw new ApiError(400,"All field are compulsory or required")

        }

      const existedUser =   User.findOne({
            $or : [{username},{email}]
        })

        if(existedUser){
            throw new ApiError(409,"Users with email name already exist")
        }

      const avatarLocalPath =  req.files?.avatar[0]?.path;
      const coverImageLocalPath  =  req.files?.coverImage[0]?.path;

      if(!avatarLocalPath){
        throw new ApiError(40,"Avatar file is required")
      }

      const avatar = await uploadOnCloudinary(avatarLocalPath)
      const coverImage = await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar){
        throw new ApiError(400,"Avatar file is required")
      }


      const user = await User.create(
        {
            fullName,
            avatar : avatar.url,
            coverImage :  coverImage?.url ||  "",
            email ,
            password,
            username : username.toLowerCase()

        }
      )
       
      const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
      )

      if(!createUser){
        throw new ApiError(500,"Something went wrong while registering a user")
      }

      return res.status(201).json(
        new ApiResponse(200,createUser,"User Registered Successfully")
      )

      





    }
)
export {registerUser}
//When the user will be register then fist the deatils will be checked that is the detals are based on the guidelines
// After that the data will be send to the data base and then we will get the  respons that the user is finally registered
//Check if user already registered
