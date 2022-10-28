const {loginSchema, PayloadSchema} = require('./userValidator');
module.exports = {
    userValidator: PayloadSchema,
    loginSchema
}