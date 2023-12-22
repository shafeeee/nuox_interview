const { body, validationResult } = require('express-validator'); 
const pino = require("pino")();

const validateForm = [
  body('totalAmount').isInt().withMessage('Due Amount must be an integer.'),
  body('duration')
    .isInt({ min: 1, max: 5 })
    .withMessage('Duration must be an integer in the range of 1 to 5.'),
];
const totalAmount = body('totalAmount');
pino.info({ message: "totalAmount", totalAmount });

module.exports = {
  validateForm,
  validationResult
};