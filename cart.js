document.addEventListener('DOMContentLoaded', () => {
    displayCart();
});

async function displayCart() {
    var cartContainer = document.getElementById("cartContainer");
    cartContainer.innerHTML = '';

    var cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    var totalItems = 0;
    var totalPrice = 0;
    var isLoggedIn = JSON.parse(sessionStorage.getItem('loggedin'));
    var userEmail = isLoggedIn[0]; // Get the first email from sessionStorage
    if (isLoggedIn.length != 0) {
        var userCart = cart.find(item => item.email === userEmail);
        if (userCart) {
            userCart.items.forEach(product => {
                totalItems += product.Quantity;
                totalPrice += product.price * product.Quantity;

                var div = document.createElement('div');
                div.classList.add('cart-item');

                var name = document.createElement('p');
                name.innerText = `Name: ${product.name}`;
                div.appendChild(name);

                var price = document.createElement('p');
                price.innerText = `Price: ${product.price}`;
                div.appendChild(price);

                var quantity = document.createElement('p');
                quantity.innerText = `Quantity: ${product.Quantity}`;
                div.appendChild(quantity);

                var increaseButton = document.createElement('button');
                increaseButton.innerText = '+';
                increaseButton.dataset.productId = product.pid; // Set the product id as a data attribute
                increaseButton.addEventListener('click', handleIncreaseQuantity); // Add click event listener
                div.appendChild(increaseButton);

                var decreaseButton = document.createElement('button');
                decreaseButton.innerText = '-';
                decreaseButton.dataset.productId = product.pid; // Set the product id as a data attribute
                decreaseButton.addEventListener('click', handleDecreaseQuantity); // Add click event listener
                div.appendChild(decreaseButton);

                var removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.dataset.productId = product.pid; // Set the product id as a data attribute
                removeButton.addEventListener('click', handleRemoveItem); // Add click event listener
                div.appendChild(removeButton);

                var img = document.createElement('img');
                img.src = product.image;
                img.alt = "Product Image";
                img.style.maxWidth = "100px";
                div.appendChild(img);

                cartContainer.appendChild(div);
            });
        } else {
            alert("No items found in the cart for the logged-in user.");
        }
    } else {
       // alert("Please login");
        location.href = "./login.html";
    }

    var totalItemsElement = document.createElement('p');
    totalItemsElement.innerText = `Total Items: ${totalItems}`;
    cartContainer.appendChild(totalItemsElement);

    var totalPriceElement = document.createElement('p');
    totalPriceElement.innerText = `Total Price: ${totalPrice}`;
    cartContainer.appendChild(totalPriceElement);
}

function handleIncreaseQuantity(event) {
    var button = event.target;
    var productId = button.dataset.productId;

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var isLoggedIn = JSON.parse(sessionStorage.getItem('loggedin'));
    var userEmail = isLoggedIn[0]; // Get the first email from sessionStorage

    var userCart = cart.find(item => item.email === userEmail);
    if (userCart) {
        var product = userCart.items.find(item => item.pid === productId);
        if (product) {
            product.Quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            displayCart(); // Refresh the cart display
        }
    }
}

function handleDecreaseQuantity(event) {
    var button = event.target;
    var productId = button.dataset.productId;

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var isLoggedIn = JSON.parse(sessionStorage.getItem('loggedin'));
    var userEmail = isLoggedIn[0]; // Get the first email from sessionStorage

    var userCart = cart.find(item => item.email === userEmail);
    if (userCart) {
        var product = userCart.items.find(item => item.pid === productId);
        if (product) {
            if (product.Quantity > 1) {
                product.Quantity--;
                localStorage.setItem("cart", JSON.stringify(cart));
                displayCart(); // Refresh the cart display
            }
        }
    }
}

function handleRemoveItem(event) {
    var button = event.target;
    var productId = button.dataset.productId;

    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var isLoggedIn = JSON.parse(sessionStorage.getItem('loggedin'));
    var userEmail = isLoggedIn[0]; // Get the first email from sessionStorage

    var userCart = cart.find(item => item.email === userEmail);
    if (userCart) {
        userCart.items = userCart.items.filter(item => item.pid !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart(); // Refresh the cart display
    }
}
