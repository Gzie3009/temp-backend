
const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const CartItem = require("../models/CartItem");
const ImageColor = require("../models/ImageColor");
const upload = require("../utils/multer");

const { uploadImagetoCloudinary } = require("../utils/ImageUploader");

// exports.checkCart = async(req , res) =>{
//   try{
//       const Id = req.body ;
//   }
//   catch(err){
//     console.log(err);
//     return res.status(500).json({
//       message:"Error While checking",
//       success:false
//     })
//   }
// }

// add product
exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      ocassion,
      collectionName,
      material,
      fabric,
      tags,
      color,
      customization,
      work,
      sku,
      price,
    } = req.body;
    // switch (true) {
    //   case !title:
    //     return res.status(500).send({ error: "Name is Required" });
    //   case !description:
    //     return res.status(500).send({ error: "Description is Required" });
    //   case !ocassion:
    //     return res.status(500).send({ error: "Ocassion is Required" });
    //   case !price:
    //     return res.status(500).send({ error: "Price is Required" });
    //   case !category:
    //     return res.status(500).send({ error: "Category is Required" });
    //   case !color:
    //     return res.status(500).send({ error: "Color is Required" });
    //   case !collectionName:
    //     return res.status(500).send({ error: "CollectionName is Required" });
    //   case !fabric:
    //     return res.status(500).send({ error: "Fabric is Required" });
    //   case !material:
    //     return res.status(500).send({ error: "Material is Required" });
    //   case !work:
    //     return res.status(500).send({ error: "Work is Required" });
    //   case !sku:
    //     return res.status(500).send({ error: "Sku is Required" });
    //   case !tags:
    //     return res.status(500).send({ error: "Tags is Required" });
    //   case !customization:
    //     return res.status(500).send({ error: "Customization is Required" });
    // }
    // const tagsArray = req.fields.Tags.split(',').map((Tag) => Tag.trim());
    const newListing = await  Product.create({
      title,
      description,
      category,
      ocassion,
      collectionName,
      material,
      fabric,
      tags,
      color,
      customization,
      work,
      sku,
      price,
    }) ;
    res.status(200).send({
      success: true,
      message: "Listing added Successfully",
      newListing,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong while adding Listing",
    });
  }
};
// list all product
exports.getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({})
      // .populate("category")
      .populate("photos");
    // populate("RatingAndReviews")

    if (!allProducts) {
      return res.status(404).json({
        sucess: false,
        message: "No product found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products :[allProducts]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while getting all product",
    });
  }
};

// like a product
exports.likeProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    console.log(userId);
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "Enter valid product",
      });
    }
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    // user id to the product
    const liked = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { likedby: userId },
      },
      { new: true }
    );
    console.log(liked);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          likedProduct: productId,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "product liked successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while liking product",
    });
  }
};
// get all like products

exports.getlikedProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    // get user id

    const likedByUser = await User.findById(userId)
      .populate("likedProduct")
      .exec();
    console.log(likedByUser);

    return res.status(200).json({
      success: true,
      message: "",
      data: likedByUser.likedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong while liking product",
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    // fetch the product and delete it

    await Product.findByIdAndDelete(productId);
    return res.status(500).json({
      success: false,
      message: " product is deleted",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting product",
    });
  }
};

// change price for a product
exports.changePrice = async (req, res) => {
  try {
    const { productId, newPrice } = req.body;
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    // fetch the product and delete it

    await Product.findByIdAndUpdate(productId, {
      price: newPrice,
    });
    return res.status(500).json({
      success: false,
      message: " product price is updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting product",
    });
  }
};



exports.addImage = async(req ,res)=>{
  try{
     
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false , 
      message:"error while adding image "
    })
  }
}

exports.getImageOfColor = async (req, res) => {
  try {
    const { inputColor, prdId } = req.body;

    const product = await ImageColor.findOne({
      productId: prdId,
      color: inputColor,
    });
    console.log(product);
    return res.status(200).json({
      success: true,
      imageUrl: product.url,
      message: "Image is uploaded on cloud",
    });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
};
// add product to cart
exports.addToCart = async (req, res) => {
  try {
    //push the product id to the cart of the user so we also need the user id
    const userId = req.user.id;

    const { productId, customization, colorImg, quantity } = req.body;
    // validate the product
    
    const productDetails = await Product.findById(productId);
    if (!productId|| !productDetails) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    const imgColor = await ImageColor.findById(colorImg); 
    if(!imgColor){
      return res.status(500).json({
        success:false , 
        message:"No such color of image found"
      })
    }
    const findUser = await User.findById(userId);
// here i am checking for the cartitem id and sending the product id bug
    if (findUser.mycart.includes(productId)) {
      return res.status(200).json({
        success: true,
        message: "already in the cart",
      });
    }
    const cartitem = await CartItem.create({
      productId,
      customization,
      colorImg,
      quantity,
    });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          mycart: cartitem._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "added to cart",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding to cart",
    });
  }
};

// remove product from cart
exports.removeFromCart = async (req, res) => {
  try {
    //push the product id to the cart of the user so we also need the user id
    const userId = req.user.id;
    const Id = req.params.id;
    console.log(Id);
    // validate the product
    if (!Id) {
      return res.status(404).json({
        success: false,
        message: "No cartItem found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { mycart: Id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "removed from cart",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while removing from cart",
    });
  }
};

// get cart of a user
exports.getCart = async (req, res) => {
  try {
    //push the product id to the cart of the user so we also need the user id
    const userId = req.user.id;


    const CartDetails1 = await User.findById(userId).populate([
      {
        path: "mycart",
        populate: {
          path: "colorImg",
          // model: 'ImageColor'
        },
      },
      {
        path: "mycart",
        populate: {
          path: "productId",
          // model: 'Product'
        },
      },
    ]);
    let result = [];
    CartDetails1.mycart.forEach((element) => {
      if (element.quantity > 0) {
        result.push(element);
      }
    });

    return res.status(200).json({
      success: true,
      message: "get cart details",
      data1: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cart",
    });
  }
};
exports.increaseQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const itemCheck = await CartItem.findById(cartItemId);
    if (!itemCheck) {
      return res.json(404).json({
        success: false,
        message: "Not found product",
      });
    }
    const findItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { $inc: { quantity: 1 } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Quantity Increased",
    });
  } catch (err) {
    console.log(err);
    return res.json(500).json({
      success: false,
      message: "Error While increasing the Quantity",
    });
  }
};
exports.decreaseQuantity = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const Item = await CartItem.findById(cartItemId);

    if (!Item) {
      return res.json(404).json({
        success: false,
        message: "Not found product",
      });
    }
    if (!(Item.quantity == 0)) {
      const findItem = await CartItem.findByIdAndUpdate(
        cartItemId,
        { $inc: { quantity: -1 } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Quantity decreased",
      });
    } else {
      const userId = req.user.id;
      if (!userId) {
        console.log("no user found");

        return res.status(500).json({
          success: false,
          message: "no user found",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { mycart: cartItemId } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Updated user",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error While decreasing the Quantity",
    });
  }
};
// add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    console.log(userId);
    const product = await Product.findById(productId); 
    if(!product)
    {
      return res.status(500).json({
        success:false , 
        message:"No Such Product Found"
      })
    }
    const findUser = await User.findById(userId);
    
    if (findUser.wishlist.includes(productId)) {
      return res.status(200).json({
        success: true,
        message: "already in the wishlist",
      });
    }

    const wishlistDetails = await User.findByIdAndUpdate(userId, {
      $push: {
        wishlist: productId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Added to wishlist",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error Occur While Adding to wishlist",
    });
  }
};

// get the wishlist

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user id");
    const FetchedCart = await User.findById(userId).populate({
      path: "wishlist",
      populate: {
        path: "photos",
        // model: 'ImageColor'
      },
    });
    return res.status(200).json({
      success: true,
      message: "wishlist Fetched Successfully",
      data: FetchedCart.wishlist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the wishlist",
    });
  }
};
exports.getWishlistIds = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("user id");
    const FetchedCart = await User.findById(userId).populate("wishlist", "_id");
    return res.status(200).json({
      success: true,
      message: "wishlist ids Fetched Successfully",
      data: FetchedCart.wishlist,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the wishlist ids",
    });
  }
};

// add category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    // create the catefory
    const createdCategory = await Category.create({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: "created category",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to create category",
    });
  }
};
// delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    // create the catefory
    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Categtory id required",
      });
    }
    await Category.findByIdAndDelete(categoryId);
    return res.status(200).json({
      success: false,
      message: "deleted category",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to delete category",
    });
  }
};
// list all the product of a category
exports.allProductsOfCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;
    // create the catefory
    if (!categoryId) {
      return res.status(404).json({
        success: false,
        message: "Categtory id required",
      });
    }
    const categoryProducts = await Product.find({
      category: categoryId,
    });

    return res.status(200).json({
      success: true,
      message: "fetched successfully",
      data: categoryProducts,
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      message: "Something went wrong",
    });
  }
};
exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("photos");
    const categoryId = product.category;
    const relatedProducts = await Product.find({
      category: categoryId,
    }).populate("photos");

    const relatedProductWithoutCurrent =  relatedProducts.filter((element)=>{
     return  element._id != id ;
    }) ; 
    const cartItemFound = await CartItem.findOne({ productId: id });
    const userId = req.user.id;

    if (!product) {
      // return next(new ErrorHandler(`No Such Product found`, 404));
      return res.status(404).json({
        message: "no product found",
      });
    } else if (!cartItemFound) {
      return res.status(200).json({
        success: true,
        message: "Product Found successfully",
        product,
        cartItemFound: false,
        buytogether:relatedProductWithoutCurrent,
      });
    }

    const findUser = await User.findById(userId);
    let check = findUser.mycart.includes(cartItemFound);
    res.status(200).json({
      success: true,
      message: "Product Found successfully",
      product,
      cartItemFound: check,
      buytogether:relatedProductWithoutCurrent,
    });
  } catch (e) {
    console.log(e.message);
  }
};
exports.getProductWithoutAuth = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("photos");

    if (!product) {
      // return next(new ErrorHandler(`No Such Product found`, 404));
      return res.status(404).json({
        message: "no product found",
      });
    }
    const categoryId = product.category;
    const relatedProducts = await Product.find({
      category: categoryId,
    });

    return res.status(200).json({
      success: true,
      message: "fetched",
      product,
      relatedProducts,
    });
  } catch (e) {
    console.log(e.message);
  }
};
exports.searchProduct = async (req, res) => {
  try {
    const searchParam = req.params.key;

    console.log(searchParam);
    const result = await Product.find({
      $or: [
        { title: { $regex: searchParam, $options: "i" } },
        { description: { $regex: searchParam, $options: "i" } },
        { auction: { $regex: searchParam, $options: "i" } },
        { material: { $regex: searchParam, $options: "i" } },
      ],
    }).populate("photos");

    return res.status(200).json({
      success: true,
      message: "success while searching",
      data: [result],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error While searching",
    });
  }
};
exports.removeFromWishlist = async (req, res) => {
  try {
    //push the product id to the cart of the user so we also need the user id
    const userId = req.user.id;
    const productId = req.params.id;
    console.log(productId);
    // validate the product
    if (!productId) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "removed from wishlist",
      dat: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while removing from wishlist",
    });
  }
};

exports.filter = async (req, res) => {
  try {
    const { fabric, collection, auction, material, title } = req.body;
    let filter = {};
    if (fabric) {
      filter.fabric = fabric;
    }
    if (collection) {
      filter.collection = new RegExp(collection, "i");
    }
    if (auction) {
      filter.auction = new RegExp(auction, "i");
    }
    console.log('Filter object before query:', filter);

const products = await Product.find(filter);
    return res.json({
      success: true,
      message: "Product Founded",
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "error while applying filter",
    });
  }
};
exports.getCategory = async(req , res)=>{
   try{
    const categories = await Category.find({}).select('name description'); 
    
    return res.status(200).json({
      success:true, 
      message:"done ", 
      categories
    })
   }
   catch(err){
    console.log(err); 
    return res.status(500).json({
      success:false , 
      message:"error while cateing"
    })
   } 

}
