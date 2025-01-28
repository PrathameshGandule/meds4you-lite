import Order from "../models/Order.js";

const authorizeOrderOwner = async (req, res, next) => {
    try {
        const order = await Order.findById(req.body.orderId);
      
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
  
        // Admins can update any payment status
        // if (req.user.role === "admin") {
        //     return next();
        // }
  
        // Check if the authenticated user owns the order
        // console.log(order.userId);
        // console.log(req.user.id);
        if (order.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access Denied: Not your order" });
        }        
  
        next();  // Proceed if authorized
    } catch (error) {
        res.status(500).json({ message: "Error verifying order ownership" });
    }
};

export default authorizeOrderOwner;