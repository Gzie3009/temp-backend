const express = require("express"); 
const router = express.Router();
const {createContact , getContact} = require("../controllers/ContactUs");

router.post("/contact-form", createContact); 
router.post("/get-contact", getContact);


module.exports = router ; 
