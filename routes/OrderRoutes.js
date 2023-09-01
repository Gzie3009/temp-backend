const express = require("express");
const router = express.Router();
const {auth,isAdmin} = require("../middlewares/auth");

const {addAddress ,addItemToOrder, placeOrder,getOrders, addAddressToOrder, getAllAddress, getOrderDeatils, createOrder} = require("../controllers/Order"); 

router.get("/all-addresses",auth,getAllAddress); // tested
router.get("/order-details",auth,getOrderDeatils); //tested
router.post("/add-address",auth,addAddress); // tested
router.post("/create-order",auth,createOrder); // tested
router.post("/addAddressToOrder",auth,addAddressToOrder); //tested
router.post("/get-orders",auth , getOrders);
module.exports = router ;

