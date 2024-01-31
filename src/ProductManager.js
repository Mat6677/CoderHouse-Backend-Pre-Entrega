import fs from "node:fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, "[]");
    }

    let data = await fs.promises.readFile(this.path, "utf-8");
    let products = JSON.parse(data);
    return products;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id == id);
    if (product) {
      return product;
    } else {
      return false;
    }
  }

  async addProduct(product) {
    const products = await this.getProducts();
    if (products.find((p) => p.title === product.title)) {
      throw new Error(
        "The product has already been added or is missing the title"
      );
    }
    const id =
      products.length === 0 ? 0 : Math.max(...products.map((p) => p.id));

    products.push({ ...product, id: id + 1 });

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async updateProduct(id, updatedProduct) {
    const products = await this.getProducts();
    const oldProduct = products.find((p) => p.id === id);
    const indexOfProduct = products.indexOf(oldProduct);
    products[indexOfProduct] = { ...oldProduct, ...updatedProduct };

    await fs.promises.writeFile(this.path, JSON.stringify(products));
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id == id);
    if (!product) {
      return {result:"Error"}
    }
    const updatedProducts = products.filter((p) => p != product);

    await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts));
  }
}

