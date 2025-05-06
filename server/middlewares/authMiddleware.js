import jwt from 'jsonwebtoken'
const {verify} = jwt
const authFunction = (req,res,next)=>{
    if(req.method === "OPTIONS"){
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1] //Bearer + token
        if(!token){
           return res.status(401).json({message: "Нет токена, доступ запрещен"})

        }
        const decoded = verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()

    }catch(e){
        console.error("Ошибка верификации токена", e)
        res.status(401).json({message: "Вы не авторизованы"})
    }

}

export default authFunction