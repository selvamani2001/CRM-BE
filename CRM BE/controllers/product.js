const Admin = require("../models/admin");
const Product = require("../models/product");

const ProductController = {
    createProduct: async (req, res) => {
        try {
            const userId = req.userId
            const { product, category, description,price}=req.body
            const admin = await Admin.findById(userId)
            if (admin) {
                const data = new Product({
                    product, category, description, createTime: new Date(),price,admin
                })
                await data.save()
                return res.status(200).json({message:"product create successfull"})
            }
            return res.status(400).json({message:"product create fail"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message:"Internal error"})
        }
    },
    getProduct: async (req, res) => {
        try {
            const product = await Product.find()
            return res.status(200).json({message:"all data ",product})
        } catch (error) {
            return res.status(500).json({message:"Internal error"})
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params
            const product = await Product.deleteOne({_id:id})
            return res.status(200).json({ message: "delete Done" })
        } catch (error) {
            return res.status(500).json({message:"Internal error"})
        }
    }
}

module.exports=ProductController