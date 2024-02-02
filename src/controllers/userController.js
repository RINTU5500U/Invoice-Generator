const userModel = require('../../src/models/userModel')
const productModel = require('../../src/models/productModel')
const mongoose = require('mongoose')
const axios = require('axios')
const pdfkit = require('pdfkit')
const jwt = require('jsonwebtoken')


module.exports = {
    register: async (req, res) => {
        try {
            const { email } = req.body
            const findUniqueEmail = await userModel.findOne({ email })
            if (findUniqueEmail) {
                return res.status(400).send({ status: true, msg: "One user is availble with this email  .. so please try different email" })
            }
            let saveData = await userModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await userModel.findOne({ email, password });
            if (!findUser) {
                return res.status(404).send({ status: false, message: "User not found" });
            }
            let token = jwt.sign({ userId: findUser._id }, "Secret-key")
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    addProduct: async (req, res) => {
        try {
            const { userId } = req.params
            req.body.userId = userId
            let saveData = await productModel.create(req.body)
            return res.status(201).send({ status: true, msg: 'Product created successfully', Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    viewQuotations: async (req, res) => {  // authorization yaha vi lagega
        try {
            const { userId } = req.params
            let fetchData = await productModel.aggregate([
                {
                    $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                    $addFields: {
                        total: { $multiply: ['$quantity', '$rate'] }
                    }
                },
                {
                    $group: {
                        _id: userId,
                        totalSum: { $sum: '$total' },
                        grandTotal: {
                            $sum: {
                                $add: [
                                    '$total',
                                    { $multiply: ['$total', 0.18] } // 18% GST
                                ]
                            }
                        },
                        products: {
                            $push: {
                                name: '$name',
                                quantity: '$quantity',
                                rate: '$rate',
                                total: '$total'
                            }
                        }
                    }
                }
            ])

            const doc = new pdfkit();
            const fileName = 'invoice.pdf';
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

            doc.pipe(res);

            doc
                .fontSize(20)
                .font('Helvetica-Bold')  // Set the font to bold
                .text(`INVOICE GENERATOR`, 200)
                .moveDown()
                .fontSize(12)
                .moveUp()

            doc
                .fontSize(12)
                .text('Product', 50, 200)
                .text('Quantity', 200, 200)
                .text('Rate', 300, 200)
                .text('Total', 400, 200);

            fetchData[0].products.forEach((item, index) => {
                doc
                    .fontSize(10)
                    .text(item.name, 50, 230 + index * 20)
                    .text(item.quantity, 220, 230 + index * 20)
                    .text(item.rate, 304, 230 + index * 20)
                    .text(item.total, 407, 230 + index * 20)
                    .font('Helvetica')  // Set the font back to normal
                    .moveDown(2)
            })

            doc
                .fontSize(10)
                .text('___________________________________________________________________________________', 10, 320)

            doc
                .fontSize(10)
                .font('Helvetica-Bold')  // Set the font to bold
                .text(`Total`, 300, 345)  // Adjust the Y-coordinate here
                .text(`INR ${fetchData[0].totalSum}`, 400, 345)
                .moveDown(2)

            doc
                .fontSize(10)
                .font('Helvetica-Bold')  // Set the font to bold
                .text(`GST`, 300, 360)  // Adjust the Y-coordinate here
                .text(`18%`, 400, 360)
                .moveDown(1);

            doc
                .fontSize(10)
                .text('_______________________________', 300, 370)
                .moveDown(2)

            doc
                .fontSize(10)
                .font('Helvetica-Bold')  // Set the font to bold
                .text(`Grand Total`, 300, 390)  // Adjust the Y-coordinate here
                .text(`₹ ${fetchData[0].grandTotal}`, 400, 390);

            doc.fontSize(10)
                .text(`Valid Until : ${new Date().toLocaleDateString()}`, 50, 600); // Adjust the Y-coordinate as needed


            doc.end();
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }https://martian-station-474043.postman.co/workspace/My-Workspace~68ec1087-9178-4aa9-8599-3755e2102b7a/collection/21299163-3cffc5c5-f24a-4302-8eb7-232123184682?action=share&creator=21299163
}


