import * as Joi from 'joi';

const BitmapRowCountValidation = Joi.number().min(1).max(182);
const BitmapColumnCountValidation = Joi.number().min(1).max(182);
const CaseCountValidation = Joi.number().min(1).max(1000);
const PixelValueValidation = Joi.number().valid(0, 1);


export { BitmapRowCountValidation, BitmapColumnCountValidation, CaseCountValidation, PixelValueValidation };
