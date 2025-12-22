import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";



const router = Router();

// const middleWare = (req,res,next)=>{
//     req.userData ={
//         user : 'rambaba',
//         count : 10  If you have to send the data to the next function you can do in the req
//     }
//     next()
// }

router.route("/register")
.post(
    upload.fields(
       [
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
       ]
    )
    
    ,registerUser)


export default router

