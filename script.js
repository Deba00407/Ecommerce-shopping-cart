document.addEventListener('DOMContentLoaded', async () => {
    const products = document.getElementById('products-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkOutBtn = document.getElementById('checkout');

    let totalPrice = 0;
    const baseURL = 'https://fakestoreapi.com/products';

    let shoppingCart = JSON.parse(localStorage.getItem('cart')) || [];
    displayCart();
    shoppingCart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

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
        shoppingCart.forEach((item, index) => {
            let cartItem = document.createElement('div');
            cartItem.innerHTML = `
                <div class="cart-item">
                    <span>${item.title} (x${item.quantity})</span>
                    <div style = "display: flex; justify-content: center; align-items: center; gap: 5px">
                    <span style="float: right;">$${(item.price * item.quantity).toFixed(2)}</span>
                    <span><button class="delete-btn " data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button></span>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        if (totalPrice != 0)
            cartTotal.innerHTML = `Total Price: $${totalPrice.toFixed(2)}`;

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.closest('button').getAttribute('data-index');
                totalPrice -= shoppingCart[index].price * shoppingCart[index].quantity;
                shoppingCart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(shoppingCart));
                displayCart();
            });
        });
    }

    let productsList = await getProducts();
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
                localStorage.setItem('cart', JSON.stringify(shoppingCart));
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
        localStorage.removeItem('cart');
        cartItems.innerHTML = 'Your cart is empty';
        cartTotal.innerHTML = '';
    });
});
