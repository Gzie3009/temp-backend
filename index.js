const express = require("express");
const dbConnect = require("./config/DbConnection");
const app = express();
const entryRoutes = require("./routes/EntryRoutes");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/ProductRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const clouldinaryConnect = require("./config/Cloudinary");
const fileUpload = require("express-fileupload");
const blogRoutes = require("./routes/BlogRoutes");
const contactRouter = require("./routes/ContactRouter");
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "https://ikonikbez.com",
  "https://ikonikbez.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
dbConnect();
clouldinaryConnect();
app.use("/api/v1/auth", entryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/contact", contactRouter);
app.listen(process.env.PORT, () => {
  console.log("Server started succesfully");
});
