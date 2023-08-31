const express=require("express");
const bodyparser=require("body-parser");
const stripe=require("stripe")("sk_test_51NbRXnGrUyf8xkB9QZp4kvUhYd7KqGWR7HHTgkVhHmpRny6LafAP4LKwJsipTHW7kWnsxhPMs0VfFPPjSaL7iKVg00vSXhYfQy")
const app=express();
var cors=require('cors');
app.use(cors());
app.use(bodyparser.json())
app.get('/',(req,res)=>{
    res.send("hello world")
})
app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    console.log(req.body,'body')
    const {amount,currency}=req.body
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2022-11-15'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      payment_method_types: ['card'],
    });
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id, 
    });
  });
app.listen(2002,()=> console.log("Running on http://192.168.100.10:2002" ))
