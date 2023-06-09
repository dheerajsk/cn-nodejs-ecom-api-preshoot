import CartItemsRepository from './cartItems.repository.js';
import CartItemModel from './cartItems.model.js';

export default class CartItemsController {
  constructor() {
    this.cartItemsRepo = new CartItemsRepository();
  }

  add=async (req, res) => {
    const { productID, quantity } = req.query;
    const userID = req.userID;
    console.log(userID);
    console.log(quantity);
    const cartItemToCreate = new CartItemModel(productID, userID, quantity);
    await this.cartItemsRepo.addItem(cartItemToCreate);
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
