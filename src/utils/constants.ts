export const responseSuccessCode = 200;
export const responseDataCreated = 201;
export const responseIncorrectDataCode = 400;
export const responseUnauthorizedDataCode = 401;
export const responseForbiddenCode = 403;
export const responseDataNotFoundCode = 404;
export const responseInternalServerErrorCode = 500;
export const errorMessage201 = 'Пользователь успешно создан';
export const errorMessage400 = 'Переданы некорректные данные';
export const errorMessage403 = 'Вы не имеет прав для удаления карточки';
export const errorMessage401 = 'Неправильные почта или пароль';
export const errorMessage404 = 'Пользователь или карточка с указанным _id не найден.';
export const errorMessagePlural404 = 'Пользователи или карточки не найдены';
export const errorMessage500 = 'Ошибка по умолчанию.';

export const secretKey = 'super-strong-secret';

export const linkRegex = /^(https?:\/\/)?(www\.)?([a-z0-9-._~:/?#[\]@!$&'()*+,;=]+)+(#\w*)?$/i;
export const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
