import * as R from 'ramda';
/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const isRed = R.equals('red');
const isGreen = R.equals('green');
const isWhite = R.equals('white');
const isBlue = R.equals('blue');
const isOrange = R.equals('orange');

const isRedStar = R.propSatisfies(isRed, 'star');
const isWhiteStar = R.propSatisfies(isWhite, 'star');
const isGreenSquare = R.propSatisfies(isGreen, 'square');
const isWhiteTriangle = R.propSatisfies(isWhite, 'triangle');
const isWhiteCircle = R.propSatisfies(isWhite, 'circle');
const isWhiteSquare = R.propSatisfies(isWhite, 'square');
const isBlueCircle = R.propSatisfies(isBlue, 'circle');
const isOrangeSquare = R.propSatisfies(isOrange, 'square');
const isGreenTriangle = R.propSatisfies(isGreen, 'triangle');

const hasTriangle = R.has('triangle');

const isEqualTo = R.curry((num, value) => R.equals(num, value));

const isOne = isEqualTo(1);
const isTwo = isEqualTo(2);
// const isThree = isEqualTo(3);
const isFour = isEqualTo(4);


// Функция для подсчета количества фигур определенного цвета
const countFiguresByColor = (color) => R.compose(
    R.length,
    R.filter(R.equals(color)),
    R.values
);

const countGreenFigures = countFiguresByColor('green');
const countBlueFigures = countFiguresByColor('blue');
const countRedFigures = countFiguresByColor('red');
const countWhiteFigures = countFiguresByColor('white');
const countOrangeFigures = countFiguresByColor('orange');

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(
    R.gte(R.__, 2),
    countGreenFigures
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(R.equals, [countRedFigures, countBlueFigures]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = R.allPass([
    isBlueCircle,
    isRedStar,
    isOrangeSquare,
    hasTriangle
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.pipe(
    R.values,
    R.reject(isWhite),
    R.countBy(R.identity),
    R.values,
    R.any(R.gte(R.__, 3))
)

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = R.allPass([
    R.compose(isTwo, countGreenFigures),
    isGreenTriangle,
    R.compose(isOne, countRedFigures)
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.allPass([
    R.compose(isFour, countOrangeFigures)
])

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.allPass([
    R.complement(isRedStar),
    R.complement(isWhiteStar)
])

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.allPass([
    R.compose(isFour, countGreenFigures)
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
    R.complement(isWhiteTriangle),
    R.complement(isWhiteSquare),
    R.converge(R.equals, [R.prop('triangle'), R.prop('square')])
]);