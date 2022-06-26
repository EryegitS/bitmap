import * as Joi from 'joi';
import { ValidationException } from '../exceptions/validation-exception';

const BitmapRowCountValidation = Joi.number().min(1).max(182);
const BitmapColumnCountValidation = Joi.number().min(1).max(182);
const CaseCountValidation = Joi.number().min(1).max(1000);
const PixelValueValidation = Joi.number().valid(0, 1);

/**
 * using for validation of number values with related joi schema
 * @param validation: Joi number validation ruleset
 * @param value which should be validated
 * @private
 */
const isNumberValid = (validation: Joi.NumberSchema, value: number): boolean => {
    const {error} = validation.validate(value);
    if (error)
        throw new ValidationException(error.message);
    return true;
};


export {
    BitmapRowCountValidation,
    BitmapColumnCountValidation,
    CaseCountValidation,
    PixelValueValidation,
    isNumberValid
};
