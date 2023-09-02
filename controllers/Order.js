const User = require("../models/User");
const Address = require("../models/Address");
const Order = require("../models/Order");
const Product = require("../models/Product");
const OrderItem = require("../models/OrderItem");

exports.createOrder = async (req, res) => {
  try {
    const products = req.body.products;

    const userId = req.user.id;
    if (products.length <= 0) {
      return res.status(500).json({
        success: false,
        messge: "Minimum one product needed"
      })
    }
    if (products.length == 1) {
      const product = products[0];
      const { productId, customization, url, color, quantity } = product;
      if (!quantity) {
        quantity = 1;
      }
      const findProduct = await Product.findById(productId);
      if (!findProduct) {
        return res.status(500).json({
          success: false,
          message: "Eroor while finding product"
        })
      }
      const price = findProduct.price * quantity;

      const orderItemCreated = await OrderItem.create({
        productId,
        color,
        customization,
        url,
        quantity
      });
      const orderCreated = await Order.create({
        user: userId,
        amount: price,
      });
      const orderUpdated = await Order.findByIdAndUpdate(orderCreated._id,
        { $push: { products: orderItemCreated._id } }, {
        new: true
      });
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $push: { orders: orderUpdated._id }
      })
      const order = await Order.findById(orderCreated._id).populate([{
        path:"products", 
        populate:{
          "path":"productId"
        }
      }

      ]); 
       
      return res.status(200).json({
        success: true,
        message: "Product added Succesfully",
        order,
      })
    }
    else {
      const orderCreated = await Order.create({
        user: userId,
        //  amount:price , 
      });
      let price = 0 ; 
      products.forEach(async (product) => {
        const { productId, customization, url, color, quantity } = product;

        const findProduct = await Product.findById(productId);
        if (!findProduct) {
          return res.status(500).json({
            success: false,
            message: "Error while finding product"
          })
        }
        if(!quantity)
        {
          quantity =1 ;
        }
        
         
        const orderValue = await Order.findById(orderCreated._id).amount ;
        
        price = (price + (findProduct.price * quantity))
        const orderItemCreated = await OrderItem.create({
          productId,
          color,
          customization,
          url,
          quantity
        });
        console.log(orderItemCreated._id);

        const orderUpdated = await Order.findByIdAndUpdate(orderCreated._id,
          { $push: { products: orderItemCreated._id } }, {
          new: true
        });
      });
    
      // add price
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $push: { orders: orderCreated._id }
      })
     
      const orderUpdate = await Order.findByIdAndUpdate(orderCreated._id,{
        amount:price
      });
      const order = await Order.findById(orderCreated._id).populate([{
        path:"products", 
        populate:{
          "path":"productId"
        }
      }

      ]); 
      return res.status(200).json({
        success: true,
        message: "all product added successfully",
        order
      })

    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while creating Order "
    })
  }
}
exports.getOrders = async (req, res) => {
  try {

    const orders = await Order.find({}).populate("products").populate("user");
    return res.status(200).json({
      success: true,
      message: "Succesfully fetched the orders",
      orders
    });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error Occur While Fetching All Orders"
    })
  }
}

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, city, state, country, streetAndHouseNo } = req.body;
    const existedAdress = await Address.findOne({ name: name });
    if (existedAdress) {
      return res.status(500).json({
        success: false,
        message: "Address with same name existed"
      })
    }
    // then 
    const createdAddress = await Address.create({ name,city, state, country, streetAndHouseNo });
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: { addresses: createdAddress._id }
    });
    return res.status(200).json({
      success: true,
      message: "Address Created Sucessfully "

    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: " Error Occur While adding address"
    })
  }
}

exports.getAllAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const Useraddresses = await User.findById(userId).populate("addresses").exec();
    console.log(Useraddresses)
    return res.status(200).json({
      sucess: true,
      message: "Addresses are in data",
      data: [Useraddresses.addresses]
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: " Error Occur While fetching addresses "
    })
  }
}

exports.addAddressToOrder = async (req, res) => {
  try {

    const { orderId, addressId } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      address: addressId
    }, { new: true });

    return res.status(200).json({
      success: true,
      message: "Address Added",
      data: updatedOrder
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      sucess: true,
      message: "Error while adding address"
    })
  }
}

exports.placeOrder = async (req, res) => {

  // check out payment intiated 

}

exports.getMyOrders = async (req, res) => {
  try {

    const id = req.user.id;

    const Details = await User.findById(id).populate("orders");

    if (!Details) {
      return res.status(404).json({
        success: false,
        message: " Error while fetching the orders"
      })
    }

    return res.status(200).json({
      success: true,
      message: " get my orders",
      Details
    })

  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching orders"
    })
  }
}
exports.getOrderDeatils = async (req, res) => {
  // all orders
  try {
    const { orderId } = req.body;
    const orderDetails = await Order.findById(orderId).populate("user").populate("products").populate("address").exec();
    return res.status(200).json({
      success: true,
      message: "get order details",
      data: orderDetails
    })
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: "false",
      message: "error while getting order details"
    })
  }
}


