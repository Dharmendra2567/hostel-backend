const stripe = require('stripe')('sk_test_51MJzWIKNMH8hnkPOqU9xEiroJrhlAc9w0JiViqrbloNVbudNrAIyb5ZrpTdBNzGFGvcbcJ7WmdQgJ5CMuXXG9hmQ00p05eq3fm');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data:{
              currency:'inr',
              product_data:{name: 'Room No: 20',
              description: '3 seater| AC | attached washroom',
              images: ['https://deohostel.com/wp-content/uploads/2022/02/3s-1.jpg'],
            },
              unit_amount:5500*100
          },
          quantity:1
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/checkout-success`,
      cancel_url: `${YOUR_DOMAIN}/checkout-error`,
    });

    res.send({ url: session.url, success: true }); // Include success flag in response
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ success: false }); // Send success flag as false if there's an error
  }
});
module.exports= app;
