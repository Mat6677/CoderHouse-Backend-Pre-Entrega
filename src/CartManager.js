import fs from "node:fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    if (!fs.existsSync(this.path)) {
      await fs.promises.writeFile(this.path, "[]");
    }

    let data = await fs.promises.readFile(this.path, "utf-8");
    let carts = JSON.parse(data);
    return carts;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id == id);
    if (cart) {
      return cart;
    } else {
      return false;
    }
  }

  async addCart(products) {
    const carts = await this.getCarts();
    const id = carts.length === 0 ? 0 : Math.max(...carts.map((p) => p.id));
    carts.push({
      products,
      id: id + 1,
    });

    await fs.promises.writeFile(this.path, JSON.stringify(carts));
  }

  async eraseCart(id){
    const carts = await this.getCarts();
    const cart = carts.find((p) => p.id == id);
    if (!cart) {
      return {result:"Error"}
    }
    const updatedCarts = carts.filter((c) => c != cart);

    await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
  }
}
