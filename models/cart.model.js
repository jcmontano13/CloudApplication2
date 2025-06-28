class Cart {
    constructor(items = [], totalQuantity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    addItem(product) {
        // add cart details to user session
        const cartItem = {
            product: product,
            quantity: 1,
            totalPrice: product.price
        }
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === product.id) { // check if product is already in the cart    
                cartItem.quantity = item.quantity + 1;
                cartItem.totalPrice = item.totalPrice + product.price;
                this.items[i] = cartItem;

                this.totalQuantity = this.totalQuantity + 1
                this.totalPrice = this.totalPrice + product.price;
                return;
            }
        }
        this.items.push(cartItem);
        this.totalQuantity = this.totalQuantity + 1
        this.totalPrice = this.totalPrice + product.price;
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.product.id === productId && newQuantity > 0) { // check if product is already in the cart   
                const cartItem = { ...item };    // get the values of the current items
                const quantityChange = newQuantity - item.quantity; // will get the QTY form the screen and get diff
                cartItem.quantity = newQuantity;                    //  will update the stored quantity using the input QTY
                cartItem.totalPrice = newQuantity * item.product.price;  // using the upd QTY multiply by unit price to get total price
                this.items[i] = cartItem;

                this.totalQuantity = this.totalQuantity + quantityChange; // total quantity updated using input qty
                this.totalPrice += quantityChange * item.product.price; // total price will be updated using input qty
                return { updatedItemPrice: cartItem.totalPrice };

            } else if (item.product.id === productId && newQuantity <= 0) {
                this.items.splice(i, 1); // built in java splice - to remove item in array
                this.totalQuantity = this.totalQuantity - item.quantity;
                this.totalPrice = this.totalPrice - item.totalPrice;
                return { updatedItemPrice: 0 };

            }
        }
    }
}

module.exports = Cart;