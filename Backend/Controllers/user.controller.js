import userModel from "../Models/user.model.js";



export const getUser = async (req, res) => {

    const {userId} = req.user;

    try {
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({success: false , message: "User not found"})
        }

        return res.status(200).json({
            success: true,
            userData : {
                isAccountVerified: user.isAccountVerified,
                name : user.name
            }
        })
    } catch (error) {
        return res.status(500).json({success : false,  message: error.message})
    }

}