const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const userId = req.user.id;
    const purchases = await Purchase.findAll({ 
        where: { userId: userId },
        include: [{
            model: Product,
            include: [Image],
        }]
    });
    return res.json(purchases);
});

const create = catchError(async(req, res) => {
    const cart = await Cart.findAll({ 
        where: { userId: req.user.id },
        attributes: ['userId', 'productId', 'quantity'],
        raw: true,
    });

    const purchases = await Purchase.bulkCreate(cart);
    //console.log(cart.attributes);
    await Cart.destroy({ where: { userId: req.user.id } });
    return res.json(purchases);
});


module.exports = {
    getAll,
    create,
}