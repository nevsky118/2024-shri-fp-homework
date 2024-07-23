import * as R from 'ramda';

/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
 import Api from '../tools/api';

 const api = new Api();

const isGreaterThanTwo = R.compose(R.gt(R.__, 2), R.length);
const isLessThanTen = R.compose(R.lt(R.__, 10), R.length);
const isLengthValid = R.both(isGreaterThanTwo, isLessThanTen);
const isPositiveNumber = R.compose(R.gt(R.__, 0), parseFloat);
const isDecimal = R.test(/^[0-9.]+$/);
const getResult = R.prop('result');
const round = R.compose(Math.round, parseFloat);

const validate = R.allPass([isLengthValid, isPositiveNumber, isDecimal]);

const toBinary = R.pipe(
    value => api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: value }),
    R.andThen(getResult),
    R.otherwise(error => {
        throw new Error(error.message);
    })
);

const toSquare = R.pipe(
    R.flip(Math.pow)(2)
)

const remainderOfThree = R.pipe(
    R.modulo(R.__, 3)
)

const getName = R.pipe(
    value => api.get(`https://animals.tech/${value}`, {}),
    R.andThen(getResult),
    R.otherwise(error => {
        throw new Error(error.message);
    })
);

const createLogValue = writeLog => v => R.tap(writeLog, v);
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const logValue = createLogValue(writeLog);

    const validateAndReturn = R.ifElse(
        validate,
        R.identity,
        R.compose(R.partial(handleError, ['ValidationError']), R.identity)
    )

    const toBinaryAndLog = R.pipe(
        toBinary,
        R.andThen(logValue)
    )

    const toLengthAndLog = R.pipe(
        R.length,
        logValue
    )

    const toSquareAndLog = R.pipe(
        toSquare,
        logValue
    )

    const remainderOfThreeAndLog = R.pipe(
        remainderOfThree,
        logValue
    )

    const getNameAndLog = R.pipe(
        getName,
        R.andThen(handleSuccess)
    )

    const f = R.pipe(
        logValue,
        validateAndReturn,
        round,
        logValue,
        toBinaryAndLog,
        R.andThen(toLengthAndLog),
        R.andThen(toSquareAndLog),
        R.andThen(remainderOfThreeAndLog),
        R.andThen(getNameAndLog),
    )

    f(value);
}

export default processSequence;
