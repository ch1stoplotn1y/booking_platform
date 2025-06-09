import ApiError from "../error/ApiError.js";
//Мидлвейр для обработки всех ошибок, не попавших в ApiError
function checkError(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: "непредвиденная ошибка" });
}

export default checkError;
