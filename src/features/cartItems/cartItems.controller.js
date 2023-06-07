import CartItemsRepository from './cartItems.repository.js';

export default class CartItemsController {
  constructor() {
    this.cartItemsRepo = new CartItemsRepository();
  }

  add=async (req, res) => {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    await this.cartItemsRepo.addItem(productID, userID, quantity);
    res.status(201).send('Cart is updated');
  }

  get=async (req, res) => {
    const userID = req.userID;
    const items = await this.cartItemsRepo.getItemsForUser(userID);
    return res.status(200).send(items);
  }

  delete=async (req, res) => {
    const userID = req.userID;
    const cartItemID = req.params.id;
    const error = await this.cartItemsRepo.deleteItem(cartItemID, userID);
    if (error) {
      return res.status(404).send(error);
    }
    return res.status(200).send('Cart Item is removed');
  }
}
