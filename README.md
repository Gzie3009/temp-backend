
Information About the Backend routes

global Base url-> 

Actual Route-> globalRoute/localRoute/Path

1. EntryRoutes
localRoute-> /auth

Type of Request   Path , purpose 

Post , /send-otp , to send the otp to the users email 
Post , /create-new-account, to sign up
Post , /login, to login the existing user
Post , /loggedInUser , to check the user is logged in or not
Post , /resetpassword, to reset the password 



2. BlogRoutes
localRoute-> /blogs

Type of Request   Path , purpose 

Post , /getAllblogs , to get all the blogs 
Post , /createBlog, to create the new blog
Get ,  /getBlog/:blogId, to get the blog with the forwared id 

3. productRoutes 

local Route : /product 

Type of Request   Path , purpose 
Post , /add-product , to add ~the product 
Post , /add-categoary, to add the categories of the product 
Get  , /all-products, to get all the added products 
Post , /add-to-cart, to put  the product into the cart 
Post , /remove-from-cart:id to remove the item from the cart 
Post , /cart  , to get the items added to cart 
Get ,  /category-products , to get the products of a certain category 
Put ,  /likedProducts , to like the product
Get ,  /all-liked-products , to get all the liked products 
Post , /add-Image , to add the image to the product one by one 
get ,  /getImageOfColor , send  the color and the product id the res img url 
post , /add-to-wishlist , to add the product to the wishlist 
post , /get-wishlist , to get the wishlist 
post , /get-wishlist-ids, to get only the ids of wishlisted products 
post , /:id , to get the information of the product whose id is sent 
post , /increase:id, to increase the quantity in cart 
post , /decrease:id , to decrease the quantity in cart 
post , /search/:key, to search products on basis of key 
post,  /filter, to filter the products 

 

4.  orderRoutes
localRoute-> /order

Type of Request   Path , purpose 

Get,  /all-addresses , to get all the adresses 
Get,  /order-details, to get the details os specific  order
Post, /add-address, to get the blog with the forwared id 
Post, /create-order, to get the blog with the forwared id 
Put,  /add-item , to add the item to the order
Post, /addAddressToOrder, to add the address to the order 



5. contactRoutes 

localRoute -> /contact 

Type of Request   Path , purpose 

Post, /contact-form, to create the enquiry posted in db 
Post,  /get-contact, to get all the posted enquiries  



--------
Pending Work backend 
filter 
profile handle 


Integrations 
shipYarri 
phonepe
