import { useState, useEffect } from "react";
export const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const valid = useValidation(value, validations);

    const onChange = (e) => {
        setValue(e.target.value);
    };

    const onBlur = () => {
        setDirty(true);
    };

    return {
        value,
        onChange,
        onBlur,
        isDirty,
        ...valid,
    };
};

export const useValidation = (value, validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false);
    const [maxLengthError, setMaxLengthError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case "minLength":
                    value.length < validations[validation]
                        ? setMinLengthError(true)
                        : setMinLengthError(false);

                    break;
                case "isEmpty":
                    value ? setEmpty(false) : setEmpty(true);
                    break;

                case "maxLength":
                    value.length > validations[validation]
                        ? setMaxLengthError(true)
                        : setMaxLengthError(false);
                    break;

                case "isEmail":
                    const emailRe =
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    emailRe.test(String(value).toLowerCase())
                        ? setEmailError(false)
                        : setEmailError(true);
                    break;
                case "isRussianPhone":
                    const phoneRe =
                        /^(\+7|[7,8]\ ?)(\d{10}|(\(?\d{3}\)?\ ?\d{3}[\-,\ ]?\d{2}[\-,\ ]?\d{2}))$/;
                    phoneRe.test(String(value).toLowerCase())
                        ? setPhoneError(false)
                        : setPhoneError(true);
                    break;
            }
        }
    }, [value, validations]);
    return {
        isEmpty,
        minLengthError,
        maxLengthError,
        emailError,
        phoneError,
    };
};
