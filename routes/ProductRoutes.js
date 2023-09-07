const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/auth");
const upload = require("../utils/multer");
const {uploadImagetoCloudinary} = require("../utils/ImageUploader"); 
const ImageColor = require("../models/ImageColor"); 
const Product = require("../models/Product"); 
const {multerUploads} = require("../controllers/Product")
const {
  addProduct,
  deleteProduct,
  getAllProducts,
  getlikedProducts,
  putImage,
  changePrice,
  addToCart,
  removeFromCart,
  getCart,
  addCategory,
  deleteCategory,
  allProductsOfCategory,
  likeProduct,
  getImageOfColor,
  addToWishlist,
  getWishlist,
  getProduct,
  getWishlistIds,
  increaseQuantity,
  decreaseQuantity,
  searchProduct,
  removeFromWishlist,
  getProductWithoutAuth,

  filter , 
  getCategory 
} = require("../controllers/Product");
router.post("/add-product",addProduct); //checked
router.post("/add-category", addCategory); // checked
router.delete("/delete-product", auth, deleteProduct); // checked
router.get("/all-products", getAllProducts); // checked
router.put("/update-price", auth, changePrice); // checked
router.post("/add-to-cart", auth, addToCart); // checked
router.post("/remove-from-cart/:id", auth, removeFromCart); // checked
router.post("/cart", auth, getCart); // checked
router.delete("/delete-category", deleteCategory); // checked
router.get("/category-products", allProductsOfCategory); // checked
router.put("/likeProduct", auth, likeProduct); // checked
router.get("/all-liked-products", auth, getlikedProducts); // checked
router.get("/getImageOfColor", getImageOfColor); // checked
router.post("/add-to-wishlist", auth, addToWishlist); // checked
router.post("/get-wishlist", auth, getWishlist); // checked
router.post("/get-wishlist-ids", auth, getWishlistIds);
router.post("/getproduct/:id", auth, getProduct);
router.post("/increase/:id", increaseQuantity);
router.post("/decrease/:id", decreaseQuantity);
router.post("/search/:key", searchProduct);
router.post("/remove-from-wishlist/:id", auth, removeFromWishlist);
router.post("/no-auth/:id", getProductWithoutAuth);
router.post("/filter",filter);
router.post("/categories",getCategory);
router.post("/add-image", upload.single("image"), async (req, res) => {
  try {
    const { productId, color , image } = req.body;
    // Upload image to cloudinary
    const productDetails = await Product.findById(productId); 
    if(!productDetails)
    {
      return res.status(404).json({
        success:false , 
        message:"No such product Found"
      })
    }
    const imageUpload = await uploadImagetoCloudinary(image);
    const url = imageUpload.secure_url;

    const ImageSaved = await ImageColor.create({ url, color, productId });
    const dbEntry = await Product.findByIdAndUpdate(productId, {
      $push: { photos: ImageSaved._id },
    });
    return res.status(200).json({
      success: true,
      message: "Image Uploaded Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding pictures",
    });
  }
});
module.exports = router;


module.exports = router;
