const dotenv = require('dotenv');
dotenv.config();
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY_STRIPE);

module.exports = async(req,res,next)=>{
    let session
    try{
    session = await stripe.checkout.sessions.retrieve(req.payment.id);
    }
    catch(err)
    {
        console.log(err)
        const error = new Error('Could not place order. Try again!')
        error.code=500
        return next(error)
    }
    let foundStatus = false;

    // Check every 500ms for the payment status
    const interval = setInterval(async () => {
        session = await stripe.checkout.sessions.retrieve(req.payment.id);
        console.log(session.payment_status)
        if (session.payment_status === 'paid') {
            foundStatus = true;
            clearInterval(interval);
            next();
        }
    }, 500);

    // After 2 seconds, stop checking and return an error if payment not successful
    setTimeout(() => {
        if (!foundStatus) {
            clearInterval(interval);
            console.log('Timeout: Payment not successful');
            const error = new Error('Order not successful! If amount deducted, it will be refunded!');
            error.code = 500;
            return next(error);
        }
    }, 1000 * 2 * 60); //2mins
}