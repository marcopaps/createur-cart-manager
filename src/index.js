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

  push() {}

  update() {}

  remove() {}
}

module.exports = CartManager;
