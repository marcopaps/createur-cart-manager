## Createur Cart Library

---

### Installation and Usage

```
$ npm install createur-cart-manager
```

```
import CartManager from "createur-cart-manager";

const Cart = new CartManager("databaseName")
```

---

- #### `Cart.push(product)` - Adds new product to the cart. Updates the quantity product was previously added

```
const product = {
    id: "1987899424833",
    featured_image:
    "//cdn.shopify.com/link-to-image",
    title: "Compound Bow",
    price: 1900.74,
    quantity: 1
};

Cart.push(product);

```

- #### `Cart.update(productId, newQuantity)` - Updates product quantity from the cart

```
const productId = "1987899424833";
const newQuantity = 5;

Cart.update(productId, newQuantity);

```

- #### `Cart.remove(productId)` - Removes a product from the cart

```
Cart.remove(productId);
```

#### (Other utility methods added)

- #### `Cart.clear()` - Removes all products from the cart

```
Cart.clear();
```

- #### `Cart.getTotalQuantity()` - Gets the current total quantity from the cart

```
Cart.getTotalQuantity();
```

---

### Technology and design

- Use [PouchDB](https://pouchdb.com/api.html) for in memory database (works in the browser and in Node)

### Needs improvement

- Add ts typings
- Add testing
- Performance improvements
