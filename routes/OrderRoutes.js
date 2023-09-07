const express = require("express");
const router = express.Router();
const {auth,isAdmin} = require("../middlewares/auth");

const {addAddress ,addItemToOrder, placeOrder,getOrders, addAddressToOrder, getAllAddress, getOrderDeatils, createOrder} = require("../controllers/Order"); 

router.post("/all-addresses",auth,getAllAddress); // tested
router.post("/order-details",auth,getOrderDeatils); //tested
router.post("/add-address",auth,addAddress); // tested
router.post("/create-order",auth,createOrder); // tested
router.post("/addAddressToOrder",addAddressToOrder); //tested
router.post("/get-orders", getOrders);
module.exports = router ;

