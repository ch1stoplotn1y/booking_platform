import ApiError from "../error/ApiError.js"
//Проверка ошибки на обработанные в апиеррор
function checkError(err,req,res,next){
    if(err instanceof ApiError){
       return res.status(err.status).json({message : err.message})
    }
    return res.status(500).json({message : "непредвиденная ошибка"})
}

export default checkError