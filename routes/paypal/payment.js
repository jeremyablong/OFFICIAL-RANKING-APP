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

        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: "http://localhost:3000/success",
                cancel_url: "http://localhost:3000/cancel"
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: "item",
                                sku: "item",
                                price: "1.00",
                                currency: "USD",
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: "USD",
                        total: "1.00"
                    },
                    description: "This is the payment description."
                }
            ]
        };

        paypal.payment.create(create_payment_json, function(error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                res.redirect(payment.links[1].href);
            }
        });
    });
});

module.exports = router;