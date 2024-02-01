const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    product: String,
    category: String,
    price: Number,
    description: String,
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    }]
})
const Product = mongoose.model('product', productSchema)

module.exports = Product;