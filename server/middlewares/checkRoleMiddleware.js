import jwt from "jsonwebtoken";

//Мидлвейр для разделения админского и пользовательского функционала
//поиск и декодирование из токена поля role и сравнение ее с ролью которая передана аргумент
const { verify } = jwt;
const checkRoleFunction = (role) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const token = req.cookies.token;
            if (!token) {
                return res
                    .status(401)
                    .json({ message: "Нет токена, доступ запрещен" });
            }
            const decoded = verify(token, process.env.JWT_SECRET_KEY);
            if (decoded.role !== role) {
                return res.status(403).json({ message: "нет доступа" });
            }
            req.user = decoded;
            next();
        } catch (e) {
            console.error("Ошибка верификации токена", e);
            res.status(401).json({ message: "Вы не авторизованы" });
        }
    };
};

export default checkRoleFunction;
