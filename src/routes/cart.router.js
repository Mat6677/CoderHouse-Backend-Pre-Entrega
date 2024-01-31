import { Router } from "express";
import { CartManager } from "../CartManager.js";
import { ProductManager } from "../ProductManager.js";

const cartManager = new CartManager("./src/Carts.json");
const productManager = new ProductManager("./src/Products.json");
const router = Router();

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.send(carts);
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(parseInt(req.params.cid));

  if (!cart) {
    return res.status(400).send({ message: "Cart has not been found" });
  }
  res.send(cart);
});

router.post("/", async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status("400").send({ message: "'Products' isn't an Array" });
  }
  await cartManager.addCart(products);

  res.send({ message: "success" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cart = await cartManager.getCartById(parseInt(req.params.cid));
  console.log(cart);
  const product = await productManager.getProductById(parseInt(req.params.pid));
  const indexOfProduct = cart.products.findIndex((p) => p.id === product.id);
  if (indexOfProduct !== -1) {
    cart.products[indexOfProduct].quantity += 1;
    await cartManager.eraseCart(cart.id);
    await cartManager.addCart(cart);

    res.send({ message: "success" });
  } else {
    const id = product.id;
    cart.products.push({ id, quantity: 1 });

    await cartManager.eraseCart(cart.id);
    await cartManager.addCart(cart);

    res.send({ message: "success" });
  }
});

export default router;
