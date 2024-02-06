import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./src/Products.json");
const router = Router();

// let products = [];

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  let { limit } = req.query;
  if (limit) {
    return res.send(products.slice(0, limit));
  }

  res.send(products);
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.send(product);
});

router.post("/", async (req, res) => {
  const product = req.body;
  if (productManager.productVerifictions(product) != undefined) {
    return res.status(400).send(productManager.productVerifictions(product));
  }
  if (await productManager.addProduct(product)) {
    return res
      .status(400)
      .send({ status: "Error", message: "The product already exists" });
  }
  await productManager.addProduct(product);
  res.send({ status: "success" });
});

router.put("/:pid", async (req, res) => {
  await productManager.updateProduct(parseInt(req.params.pid), req.body);

  res.send({ status: "success" });
});

router.delete("/:pid", async (req, res) => {
  if (await productManager.deleteProduct(parseInt(req.params.pid))) {
    res.status(400).send({ message: "Product not found" });
  }
  res.send({ status: "success" });
});

export default router;
