import userModel from "../models/user.js";

export default class UserManager
{
    get =()=>
    {
        return userModel.find().lean();
    }

    getBy =(param)=>
    {
        return userModel.findOne(param).lean();
    }

    getByMongose =(param)=>
    {
        return userModel.findOne(param);
    }

    create = (user)=>{
        return userModel.create(user);
    }

    getUserByResetToken = (token) => 
    {
        return userModel.findOne({ resetToken: token });
    }
}