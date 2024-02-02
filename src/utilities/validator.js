const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)

const passwordResponse = { 'string.pattern.base': ` "Password should be minimum 8 and maximum 15 character.It contains atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character"` }

const errors = (check) => {
    let messages = { "string.base": `${check} should be a type of 'String'.`, "string.empty": `${check} cannot be an empty field.`, "any.required": `${check} is a required field.` }
    return messages
}

//"^[0-9]{5}(?:-[0-9]{4})?$"
// valid ISBN => 978-1-56619-909-4 , 1257561035 , 1248752418865
// ISBN => /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/

module.exports = {
    //SCHEMA VALIDATION FOR USERMODEL
    userModel: joi.object({
        name: joi.string().trim().regex(/^[A-Za-z ]+$/).messages({ 'string.pattern.base': `name is not valid.` }).required().messages(errors("Username")),
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({ 'string.pattern.base': `emailId is in inValid format` }).required().messages(errors("emailId")),
        password: joi.string().trim().min(6).messages({ 'string.min': 'password should be minimum 8 characters' }).max(15).messages({ 'string.max': 'password should be maximum 15 characters' })
            .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password")),
    }),
    //SCHEMA VALIDATION FOR PRODUCTMODEL
    productModel: joi.object({
        name: joi.string().trim().required().messages(errors("NAME")),
        userId: joi.objectId().required().messages(errors("UserId")),
        quantity: joi.number().messages({ "number.base": `quantity should be a type of number` }),
        rate: joi.number().messages({ "number.base": `rate should be a type of number` }),
    }),
    //LOGIN VALIDATION
    loginValidation: joi.object({
        email: joi.string().trim().regex(/.+\@.+\..+/).messages({ 'string.pattern.base': `emailId is in inValid format` }).required().messages(errors("emailId")),
        password: joi.string().trim().min(8).messages({ 'string.min': 'password should be minimum 8 characters' }).max(15).messages({ 'string.max': 'password should be maximum 15 characters' })
            .regex(/^\S{8,24}$/).messages(passwordResponse).required().messages(errors("Password"))
    })
}