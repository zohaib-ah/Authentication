import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) =>{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).json({success: false, message: "login again"})
    }

    try {
        const tokenInfo = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenInfo.id){
            req.user = {userId: tokenInfo.id}
        }
        else{
            return res.status(401).json({success: false, message: "login again"})
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: error.message})
    }
}

export default userAuth;