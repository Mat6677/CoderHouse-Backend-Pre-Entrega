import express from "express";
import path from "path";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/cart.router.js";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts/", cartsRouter);

app.listen(PORT, () => console.log("Server up and running on port: " + PORT));
