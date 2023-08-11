import OrderRepository from "./order.repository.js";

export default class OrderController {
    constructor() {
        this.orderRepository = new OrderRepository();
      }
    
      async placeOrder(req, res) {
        const userId = req.userID;
        try {
            const order = await this.orderRepository.placeOrder(userId);
            res.status(201).json(order);
        } catch(error) {
            console.log(error);
            res.status(500).send("Failed to place order");
        }
    }
}

