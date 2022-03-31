import PouchDB from "pouchdb";
class CartManager {
  constructor(dbName) {
    this._db = new PouchDB(dbName);
    this.cartItems = [];
    this.totalPrice = 0;
    this.totalQuantity = 0;
    this.gst = 0;
    this.getCart();
  }

  getCart() {
    let _totalPrice = 0;
    let _totalQuantity = 0;

    return this._db
      .allDocs({ include_docs: true })
      .then((docs) => {
        let subTotal = 0;

        this.cartItems = docs.rows.map((item) => {
          const itemData = item.doc;

          subTotal = this._formatPrice(itemData.price * itemData.quantity);
          _totalPrice += subTotal;
          _totalQuantity += itemData.quantity;

          return {
            ...itemData,
            subTotal,
          };
        });
      })
      .then(() => {
        this.totalPrice = this._formatPrice(_totalPrice);
        this.totalQuantity = _totalQuantity;

        // ref: gst.calculatorsaustralia.com.au
        this.gst = this._formatPrice(_totalPrice - _totalPrice / 1.1);

        return {
          cartItems: this.cartItems,
          totalPrice: this.totalPrice,
          totalQuantity: this.totalQuantity,
          gst: this.gst,
        };
      });
  }

  _getProductById(productId) {
    return this.cartItems.find((item) => item.id === productId);
  }

  _formatPrice(amount) {
    return +amount.toFixed(2);
  }

  push(product) {
    const existingProduct = this._getProductById(product.id);

    if (existingProduct) {
      return this.update(
        existingProduct.id,
        existingProduct.quantity + product.quantity
      );
    }

    return this._db
      .post(product)
      .then(() => this.getCart())
      .catch((error) => {
        return console.error(error);
      });
  }

  update(productId, quantity) {
    const existingProduct = this._getProductById(productId);

    if (existingProduct) {
      return this._db
        .put({
          ...existingProduct,
          quantity: quantity,
          _id: existingProduct._id,
          _rev: existingProduct._rev,
        })
        .then(() => this.getCart())
        .catch((error) => {
          return console.error(error);
        });
    }
  }

  async getTotalQuantity() {
    // I intentionally add this as a utilty method to just
    // get cart total qty and avoid getting all cart data
    return this.totalQuantity;
  }

  remove() {}
}

module.exports = CartManager;
