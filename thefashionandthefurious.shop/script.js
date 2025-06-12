// Product data with prices in Taka
const products = {
  'Red Bull Racing Tee': { price: 649, id: 'RB001', image: 'assets/placeholder.svg' },
  'Ferrari Classic Edition': { price: 649, id: 'FR001', image: 'assets/placeholder.svg' },
  'Mercedes AMG F1 Special': { price: 649, id: 'MB001', image: 'assets/placeholder.svg' },
  'McLaren Heritage': { price: 649, id: 'MC001', image: 'assets/placeholder.svg' }
};

// Debug flag
const DEBUG = true;

function log(message, data) {
  if (DEBUG) {
    if (data) {
      console.log(`[Debug] ${message}`, data);
    } else {
      console.log(`[Debug] ${message}`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  log('DOM fully loaded');

  // Find and initialize all DOM elements
  const checkoutForm = document.getElementById('checkoutForm');
  const purchaseButtons = document.querySelectorAll('.purchase-btn');
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  const cartButton = document.getElementById('cartButton');
  const cartCount = document.getElementById('cartCount');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentProduct = null;

  log('DOM elements initialized');
  log(`Found ${purchaseButtons.length} purchase buttons`);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Update cart count display
  function updateCartCount() {
    if (cart.length > 0) {
      cartCount.style.display = 'inline-block';
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    } else {
      cartCount.style.display = 'none';
    }
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Add product to cart
  function addToCart(product) {
    const existingProduct = cart.find(item => 
      item.name === product.name && item.size === product.size
    );
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.push(product);
    }
    saveCart();
    log('Product added to cart:', product);
    updateCartCount();
    alert(`${product.name} (Size: ${product.size}) added to cart.`);
  }

  // Modal elements
  const modal = document.getElementById('purchaseModal');
  const modalClose = modal.querySelector('.modal-close');
  const modalProductImage = modal.querySelector('.modal-product-image');
  const modalProductName = modal.querySelector('.modal-product-info h3');
  const modalProductPrice = modal.querySelector('.modal-product-price');
  const modalSize = document.getElementById('modalSize');
  const modalQuantity = document.getElementById('modalQuantity');
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckout');
  const addToCartFromModalBtn = document.getElementById('addToCartFromModal');

  // Open modal with product info
  function openModal(productName) {
    currentProduct = products[productName];
    modalProductImage.src = currentProduct.image;
    modalProductImage.alt = productName;
    modalProductName.textContent = productName;
    modalProductPrice.textContent = `${currentProduct.price} Taka`;
    modalSize.value = 'M'; // Reset size to default
    modalQuantity.value = '1'; // Reset quantity to default
    modal.style.display = 'block';
  }

  // Close modal
  modalClose.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Purchase button click opens modal
  purchaseButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const productName = btn.closest('.product').querySelector('h3').textContent;
      log(`Purchase button clicked for: ${productName}`);
      openModal(productName);
    });
  });

  // Add to cart from modal
  addToCartFromModalBtn.addEventListener('click', () => {
    if (currentProduct) {
      const size = modalSize.value;
      const quantity = parseInt(modalQuantity.value);
      if (quantity < 1) {
        alert('Please select a valid quantity');
        return;
      }
      addToCart({
        name: modalProductName.textContent,
        price: currentProduct.price,
        size: size,
        quantity: quantity,
        image: currentProduct.image
      });
      modal.style.display = 'none';
    }
  });

  // Proceed to checkout from modal
  proceedToCheckoutBtn.addEventListener('click', () => {
    if (currentProduct) {
      const size = modalSize.value;
      const quantity = parseInt(modalQuantity.value);
      if (quantity < 1) {
        alert('Please select a valid quantity');
        return;
      }
      addToCart({
        name: modalProductName.textContent,
        price: currentProduct.price,
        size: size,
        quantity: quantity,
        image: currentProduct.image
      });
      modal.style.display = 'none';
      window.location.href = 'checkout.html';
    }
  });

  // Add to cart button click adds directly to cart with default size M and quantity 1
  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const productElement = btn.closest('.product');
      const productName = productElement.querySelector('h3').textContent;
      const productPriceText = productElement.querySelector('.product-price').textContent;
      const price = parseInt(productPriceText.replace(/[^0-9]/g, ''), 10);
      addToCart({
        name: productName,
        price: price,
        size: 'M',
        quantity: 1,
        image: products[productName].image
      });
    });
  });

  // Cart button navigates to checkout page
  cartButton.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    window.location.href = 'checkout.html';
  });

  updateCartCount();
});
