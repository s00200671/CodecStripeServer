require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const corsOptions = {
    origin: "https://portal-302.powerappsportals.com",
    credentials: true // for cookies
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

const port = process.env.PORT || 3000
const stripe = require("stripe")(process.env["STRIPE_SK"]);

app.get("/", async (req, res) => {console.log("hello"), res.json({stauts: 200})})
app.post('/create-checkout-session', async (req, res) => {
console.log(req.query);

    var obj = {
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: req.query.price_id, //req.params.price_id,
                quantity: 1,
            },
        ],
        mode: "payment",
        payment_intent_data: {
            metadata: {
                orderId: req.query.order_id
            }
        },
        success_url: "https://portal-302.powerappsportals.com/account/payments/successfulPayment?&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://portal-302.powerappsportals.com/account/payments",
        customer_email: req.query.customer_email //req.params.cus_email
    };

    if (req.query.grantd) obj.discounts = [{coupon : req.query.grantd}];

    const session = await stripe.checkout.sessions.create(obj);

    res.status(200).send({surl: session.url});
});

app.listen(port, () => console.log("Port open"));