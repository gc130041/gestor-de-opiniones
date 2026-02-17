import { validationResult } from 'express-validator';

export const checkValidators = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json(errors);
}
next();
};