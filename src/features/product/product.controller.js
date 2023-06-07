import ProductRepository from './product.repository.js';

export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  getAllProducts = async (req, res) => {
    const products = await this.productRepository.getAll();
    res.status(200).send(products);
  }

  addProduct = async (req, res) => {
    const { name, price, sizes } = req.body;
    const newProduct = {
      name,
      price: parseFloat(price),
      sizes: sizes.split(','),
      imageUrl: req.file.filename,
    };
    const createdRecord = await this.productRepository.add(newProduct);
    res.status(201).send(createdRecord);
  }

  rateProduct = async (req, res) => {
    const userID = req.query.userID;
    const productID = req.query.productID;
    const rating = req.query.rating;
    await this.productRepository.rateProduct(userID, productID, rating);
    res.status(200).send('Rating has been added');
  }

  getOneProduct = async (req, res) => {
    const id = req.params.id;
    const product = await this.productRepository.getOne(id);
    if (!product) {
      res.status(404).send('Product not found');
    } else {
      res.status(200).send(product);
    }
  }

  filterProducts = async (req, res) => {
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const category = req.query.category;
    const result = await this.productRepository.filter(minPrice, maxPrice, category);
    res.status(200).send(result);
  }
}
