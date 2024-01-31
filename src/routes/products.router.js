import { Router } from "express";
import { ProductManager } from "../ProductManager.js";

const productManager = new ProductManager("./src/Products.json");
const router = Router();

// let products = [];

function productVerifictions(product) {
  if (
    !product.hasOwnProperty("title") ||
    typeof product.title !== "string" ||
    product.title.length < 1
  ) {
    return {
      result: "Error",
      message:
        'The "title" property must exist, be of type string and have more than 1 character length.',
    };
  }
  if (
    !product.hasOwnProperty("description") ||
    typeof product.description !== "string"
  ) {
    return {
      result: "Error",
      message: 'The "description" property must exist and be of type string.',
    };
  }

  if (!product.hasOwnProperty("price") || typeof product.price !== "number") {
    return {
      result: "Error",
      message: 'The "price" property must exist and be of type number.',
    };
  }
  if (!product.hasOwnProperty("code") || typeof product.code !== "string") {
    return {
      result: "Error",
      message: 'The "code" property must exist and be of type string.',
    };
  }

  if (!product.hasOwnProperty("stock") || typeof product.stock !== "number") {
    return {
      result: "Error",
      message: 'The "stock" property must exist and be of type number.',
    };
  }

  if (product.hasOwnProperty("status") && typeof product.status !== "boolean") {
    return {
      result: "Error",
      message: 'The "status" property be of type boolean.',
    };
  }

  if (!product.hasOwnProperty("category") || typeof product.code !== "string") {
    return {
      result: "Error",
      message: 'The "category" property must exist and be of type string.',
    };
  }

  if (
    product.hasOwnProperty("thumbnail") &&
    !Array.isArray(product.thumbnail)
  ) {
    return {
      result: "Error",
      message: 'The "thumbail" property must be an Array of strings.',
    };
  }
}

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  let { limit } = req.query;
  if (limit) {
    return res.send(products.slice(0, limit));
  }

  res.send({ products });
});

router.get("/:pid", async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (!product) {
    return res.result(404).json({ error: "Product not found" });
  }
  res.send(product);
});

router.post("/", async (req, res) => {
  const products = await productManager.getProducts();
  const product = req.body;
  if (productVerifictions(product) != undefined) {
    return res.status(400).send(productVerifictions(product));
  }
  if (products.find((p) => p.id == product.id)) {
    return res
      .result(400)
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
