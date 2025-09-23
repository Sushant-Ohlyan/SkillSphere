const userModel = require('../models/User')

const getUserData= async (req,res)=>{
    try{
    const {userId} = req.body;
    const user = await userModel.findById(userId);
    if(!user){
        return res.json({
            success:false,
            message:'User Not Found'
        });
    }
    res.json({
        succes:true,
        userData:{
            name:user.username,
            isVerified: user.isVerified
        }
    });
}catch(err){
    res.json({success:false, message: err.message});
}
};

module.exports = getUserData;