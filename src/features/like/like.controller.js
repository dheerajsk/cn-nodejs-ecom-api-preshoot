import LikeRepository from './like.repository.js';

export default class LikeController{

    constructor() {
        this.likeRepository = new LikeRepository();
      }
    

  async likeItem(req, res) {
    try {
     const {id, type}=req.body;
      if (type !== 'Product' && type !== 'Category') {
        return res.status(400).json({ error: "Invalid type. Must be either 'Product' or 'Category'." });
      }
      console.log(req.userID);
      if(type=='Product'){
        await this.likeRepository.likeProduct(req.userID, id)
      }else{
        await this.likeRepository.likeCategory(req.userID, id)
      }
      res.status(200).json({ message: `Successfully liked the ${type}` });

    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Server Error' });
    }
  }

  async getLikes(req, res) {
    try {
        const { likeableId, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, likeableId);

      res.status(200).json(likes);

    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

