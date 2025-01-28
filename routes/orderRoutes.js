import { Router } from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { verifyToken , authorizeRoles } from "../middlewares/authMiddleware.js";
const orderRoutes = Router();

// Create an order
orderRoutes.get('/create', verifyToken, authorizeRoles("user"), async (req, res, next) => {
    // const { userId } = req.body;
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

    if (!cart.items.length) {
        return res.status(400).json({ error: 'Your cart is empty' });
    }

    const totalAmount = cart.items.reduce(
        (total, item) => total + item.productId.price * item.quantity, 0
    );

    const order = new Order({
        userId,
        items: cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
        })),
        totalAmount
    });

    await order.save();

    // Optionally clear the cart after order creation
    // cart.items = [];
    // await cart.save();

    res.status(200).json({ orderId: order._id, totalAmount });
    } catch (err) {
        next(err);
    }
});

// Update payment status
orderRoutes.post('/payment-success', verifyToken, authorizeRoles("user"), async (req, res, next) => {
    const { paymentId, orderId } = req.body;
    const userId = req.user.id
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // updating order status
        order.paymentStatus = 'success';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
    	await order.save();

        // clearing cart after successfuk payment
        const cart = await Cart.findOne({ userId });
        cart.items = [];
        await cart.save();

    	res.status(200).json({ message: 'Payment successful' });
  	} catch (err) {
    	console.error('Error updating payment status:', err);
    	next(err);
  	}
});

export default orderRoutes;