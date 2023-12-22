const { body, validationResult } = require('express-validator'); 

const validateForm = [
  body('mobile_number').isInt().withMessage('Mobile number must be an integer.'),
  body('email').isEmail().withMessage('Invalid email format.'),
  body('name').isLength({ max: 255 }).withMessage('Name must be less than or equal to 255 characters.'),
  body('country').isLength({ max: 255 }).withMessage('Country must be less than or equal to 255 characters.'),
];

module.exports = {
  validateForm,
  validationResult
};