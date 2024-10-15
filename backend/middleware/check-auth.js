const jwt = require('jsonwebtoken')
module.exports = (req,res,next)=>{
    if(req.method==='OPTIONS')
    {
        return next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1] //Authorization : 'bearer TOKEN'
        if(!token)
        {
            throw new Error('Authentication Failed')
        }
        const decodedToken = jwt.verify(token, 'myprivatekey')
        req.userData={userId : decodedToken.userId,
            userEmail : decodedToken.email
        }
        next()
    }
    catch(err)
    {
        const error=new Error('Authentication Failed');
        error.code=401
        return next(error)
    }
}