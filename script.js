document.addEventListener('DOMContentLoaded', async () => {
    const products = document.getElementById('products-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkOutBtn = document.getElementById('checkout');

    let totalPrice = 0;
    const baseURL = 'https://fakestoreapi.com/products';

    async function getProducts() {
        try {
            let response = await fetch(baseURL);
            if (response.ok) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    function displayCart() {
        if (shoppingCart.length === 0) {
            cartItems.innerHTML = 'Your cart is empty';
            cartTotal.innerHTML = '';
            return;
        }
        cartItems.innerHTML = '';
        shoppingCart.map(item => {
            let cartItem = document.createElement('div');
            cartItem.innerHTML = `
                <div class="cart-item">
                    <span>${item.title} (x${item.quantity})</span>
                    <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        if (totalPrice != 0)
            cartTotal.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;
    }

    let shoppingCart = [];
    let productsList = await getProducts();
    console.log(productsList);
    displayProductList();

    function displayProductList() {
        productsList.map(product => {
            let newProduct = document.createElement('div');
            newProduct.innerHTML = `
                <div class="product">
                <img src="${product.image}" alt="${product.title}">
                <div class = "desc">
                <span>${product.title}</span>
                <span>Price : $${product.price}</span>
                <input class="product-quantity" type="number" min="1" max="10" placeholder="Enter quantity">
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
            `;
            products.appendChild(newProduct);
        });

        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                const product = productsList.find(product => product.id == id);
                const quantityInput = event.target.previousElementSibling;
                const quantity = parseInt(quantityInput.value) || 1;

                shoppingCart.push({
                    title: product.title,
                    quantity: quantity,
                    price: product.price
                });

                totalPrice += product.price * quantity;
                console.log(totalPrice);
                displayCart();
            });
        });
    }

    checkOutBtn.addEventListener('click', () => {
        if (shoppingCart.length === 0)
            return alert('Your cart is empty');
        alert('Thank you for shopping with us!');
        shoppingCart = [];
        totalPrice = 0;
        cartItems.innerHTML = 'Your cart is empty';
        cartTotal.innerHTML = '';
    })
});