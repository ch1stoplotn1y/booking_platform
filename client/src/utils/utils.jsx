import * as Icon from "../icons/Icons";
//FIXME обработка перевода типов жилья на русский
export const typeTranslations = {
    apartment: "Квартира",
    house: "Дом",
    room: "Комната",
    hotel: "Отель",
    villa: "Вилла",
    penthouse: "Пентхаус",
    studio: "Студия",
    cottage: "Коттедж",
};
//Отображение названий удобств на русском
export const amenityTranslations = {
    Kitchen: "Кухня",
    Parking: "Парковка",
    Pool: "Бассейн",
    Gym: "Спортзал",
    "Work zone": "Рабочее место",
    TV: "Телевизор",
};

//Иконки удобств
export const amenityIcons = {
    Kitchen: <Icon.KitchenIcon />,
    Parking: <Icon.ParkingIcon />,
    Pool: <Icon.PoolIcon />,
    Gym: <Icon.GymIcon />,
    "Work zone": <Icon.WorkZoneIcon />,
    "Wi-Fi": <Icon.WifiIcon />,
    TV: <Icon.TvIcon />,
    "Стиральная машина": <Icon.WashingMachineIcon />,
    Кондиционер: <Icon.AirIcon />,
    Джакузи: <Icon.BathroomIcon />,
    "Внешние камеры видеонаблюдения": <Icon.CameraIcon />,
    "Детские книги и игрушки": <Icon.BabyItemsIcon />,
    "Предметы первой необходимости": <Icon.FirstItemsIcon />,
    "Можно с питомцами": <Icon.PetsIcon />,
    Сейф: <Icon.SafeIcon />,
    "Постельное белье": <Icon.BedIcon />,
};

//Для склонения количества кроватей
export function getBedWord(count) {
    if (!count) return "кроватей";
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "кроватей";
    if (lastDigit === 1) return "кровать";
    if (lastDigit >= 2 && lastDigit <= 4) return "кровати";
    return "кроватей";
}
//Для склонения количества дней
export function getDayWord(count) {
    if (!count) return "дней";
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "дней";
    if (lastDigit === 1) return "день";
    if (lastDigit >= 2 && lastDigit <= 4) return "дня";
    return "дней";
}
//Для склонения количества гостей
export function getGuestsWord(count) {
    if (!count) return "гостей";
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "гостей";
    if (lastDigit === 1) return "гость";
    if (lastDigit >= 2 && lastDigit <= 4) return "гостя";
    return "гостей";
}
//Для склонения количества душевых
export function getBathWord(count) {
    if (!count) return "душевых";
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "душевых";
    if (lastDigit === 1) return "душевая";
    if (lastDigit >= 2 && lastDigit <= 4) return "душевые";
    return "душевых";
}
//Для склонения количества отзывов
export function getReviewWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "отзывов";
    if (lastDigit === 1) return "отзыв";
    if (lastDigit >= 2 && lastDigit <= 4) return "отзыва";
    return "отзывов";
}

export default {
    typeTranslations,
    amenityTranslations,
    getBedWord,
    getGuestsWord,
    getBathWord,
    getReviewWord,
};
