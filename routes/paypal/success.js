const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const app = express();
const config = require("config");
const mongo = require("mongodb");
const paypal = require("paypal-rest-sdk");

mongo.connect(config.get("mongoURI"),  { useNewUrlParser: true }, { useUnifiedTopology: true }, cors(), (err, db) => {
    router.post("/", (req, res) => {
        // deconstruct response body
        let PayerID = req.query.PayerID;
        let paymentId = req.query.paymentId;
        let execute_payment_json = {
            payer_id: PayerID,
            transactions: [
                {
                    amount: {
                        currency: "USD",
                        total: "1.00"
                    }
                }
            ]
        };

        paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Get Payment Response");
                console.log(JSON.stringify(payment));
                res.render("success");
            }
        });
    });
});

module.exports = router;