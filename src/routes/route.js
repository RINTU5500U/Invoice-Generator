const express = require("express")
const router = express.Router()

const {register, login, addProduct, viewQuotations} = require('../controllers/userController')
const {authentication, authorization} = require('../middlewares/auth')
const { userValidation, loginValidation, productValidation } = require("../middlewares/validationMware")

router.post('/register', userValidation, register)
router.post('/login', loginValidation, login)
router.post('/addProduct/:userId', authentication, productValidation, addProduct)
router.get('/viewQuotations/:userId', authentication, authorization, viewQuotations)
// router.get('/getInvoicePdf/:userId', authentication, authorization, getInvoicePdf)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router