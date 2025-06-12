overwrite:true
// Product data with prices in Taka
const products = {
  'Red Bull Racing Tee': { price: 2499, id: 'RB001', image: 'assets/placeholder.svg' },
  'Ferrari Classic Edition': { price: 2799, id: 'FR001', image: 'assets/placeholder.svg' },
  'Mercedes AMG F1 Special': { price: 2499, id: 'MB001', image: 'assets/placeholder.svg' },
  'McLaren Heritage': { price: 2799, id: 'MC001', image: 'assets/placeholder.svg' }
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

// Initialize current product and step
let currentProduct = null;
let currentStep = 1;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  log('DOM fully loaded');

  // Initialize all DOM elements and event handlers after full page load
  window.addEventListener('load', () => {
    log('Page fully loaded');
    
    // Find and initialize all DOM elements
    const modal = document.getElementById('checkoutModal');
    const closeBtn = document.getElementById('checkoutClose');
    const checkoutForm = document.getElementById('checkoutForm');
    const progressSteps = document.querySelectorAll('.progress-step');
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const productPrice = document.getElementById('productPrice');
    const deliveryCharge = document.getElementById('deliveryCharge');
    const orderTotal = document.getElementById('orderTotal');
    const purchaseButtons = document.querySelectorAll('.purchase-btn');

    log('DOM elements initialized');
    log(`Found ${purchaseButtons.length} purchase buttons`);
    
    // Add click handlers to purchase buttons
    purchaseButtons.forEach((btn, index) => {
      btn.addEventListener('click', (e) => {
        const productName = btn.closest('.product').querySelector('h3').textContent;
        log(`Purchase button clicked for: ${productName}`);
        initCheckout(productName);
      });
    });

    // Verify critical elements
    if (!modal) log('Error: Checkout modal not found');
    if (!checkoutForm) log('Error: Checkout form not found');

    // Initialize checkout process
    function initCheckout(productName) {
      try {
        log(`Initializing checkout for: ${productName}`);
        
        if (!modal) {
          log('Error: Modal element not found');
          return;
        }

        currentProduct = {
          name: productName,
          ...products[productName]
        };
        log('Current product set:', currentProduct);
        
        // Reset form
        if (!checkoutForm) {
          log('Error: Checkout form not found');
          return;
        }
        checkoutForm.reset();
        log('Form reset complete');
        
        // Update product details
        const productNameEl = document.getElementById('checkoutProductName');
        const productImageEl = document.getElementById('checkoutProductImage');
        
        if (!productNameEl || !productImageEl) {
          log('Error: Product elements not found');
          return;
        }
        
        productNameEl.textContent = productName;
        productImageEl.src = currentProduct.image;
        log('Product details updated');
        
        // Update order summary
        updateOrderSummary();
        
        // Show first step
        showStep(1);
        
        // Show modal
        log('Displaying modal...');
        modal.style.display = 'block';
        log('Modal displayed');
        
      } catch (error) {
        log('Error in initCheckout:', error.message);
        console.error(error);
      }
    }

    // Update order summary
    function updateOrderSummary() {
      if (!currentProduct) return;
      
      productPrice.textContent = `${currentProduct.price} Taka`;
      
      const deliveryOption = checkoutForm.delivery.value;
      const deliveryFee = deliveryOption === 'inside' ? 70 : deliveryOption === 'outside' ? 140 : 0;
      deliveryCharge.textContent = `${deliveryFee} Taka`;
      
      const total = currentProduct.price + deliveryFee;
      orderTotal.textContent = `${total} Taka`;
      log(`Order summary updated - Total: ${total} Taka`);
    }

    // Show specific step
    function showStep(step) {
      currentStep = step;
      log(`Showing step ${step}`);
      
      // Update progress bar
      progressSteps.forEach(stepEl => {
        const stepNum = parseInt(stepEl.dataset.step);
        if (stepNum <= step) {
          stepEl.classList.add('active');
        } else {
          stepEl.classList.remove('active');
        }
      });
      
      // Show current step form
      checkoutSteps.forEach(stepForm => {
        const stepNum = parseInt(stepForm.dataset.step);
        stepForm.style.display = stepNum === step ? 'block' : 'none';
      });
    }

    // Validate current step
    function validateStep(step) {
      const requiredFields = {
        1: ['size'],
        2: ['name', 'email', 'phone', 'address', 'delivery'],
        3: []
      };
      
      const fields = requiredFields[step];
      for (const field of fields) {
        if (field === 'size') {
          const sizeSelected = Array.from(checkoutForm.elements[field]).some(radio => radio.checked);
          if (!sizeSelected) {
            alert('Please select a size');
            log('Validation failed: size not selected');
            return false;
          }
        } else {
          const input = checkoutForm.elements[field];
          if (!input.value) {
            alert(`Please fill in the ${field} field`);
            log(`Validation failed: ${field} is missing`);
            return false;
          }
        }
      }
      
      return true;
    }

    // Event Listeners
    nextButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          showStep(currentStep + 1);
        }
      });
    });

    prevButtons.forEach(button => {
      button.addEventListener('click', () => {
        showStep(currentStep - 1);
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      log('Modal closed');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        log('Modal closed (clicked outside)');
      }
    });

    // Update order summary when delivery option changes
    checkoutForm.addEventListener('change', (e) => {
      if (e.target.name === 'delivery') {
        log(`Delivery option changed to: ${e.target.value}`);
        updateOrderSummary();
      }
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      log('Form submitted');
      
      if (!validateStep(currentStep)) return;
      
      const formData = new FormData(checkoutForm);
      const orderData = {
        product: currentProduct.name,
        productId: currentProduct.id,
        price: currentProduct.price,
        size: formData.get('size'),
        customerName: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        deliveryLocation: formData.get('delivery') === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
        deliveryCharge: formData.get('delivery') === 'inside' ? 70 : 140,
        total: currentProduct.price + (formData.get('delivery') === 'inside' ? 70 : 140),
        paymentMethod: 'Cash on Delivery',
        timestamp: new Date().toISOString()
      };
      
      // Send order notification to server
      try {
        log('Sending order notification...');
        const response = await fetch('/send-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send notification: ${errorText}`);
        }

        log('Order notification sent successfully');
        
        // Show success message to customer
        alert(
          `Order placed successfully!\n\n` +
          `Product: ${orderData.product}\n` +
          `Size: ${orderData.size}\n` +
          `Price: ${orderData.price} Taka\n` +
          `Delivery Charge: ${orderData.deliveryCharge} Taka\n` +
          `Total: ${orderData.total} Taka\n` +
          `Payment Method: ${orderData.paymentMethod}\n\n` +
          `Delivery to: ${orderData.deliveryLocation}\n` +
          `Thank you for your purchase, ${orderData.customerName}!`
        );
        
        modal.style.display = 'none';
      } catch (error) {
        log('Error sending notification:', error);
        alert('Failed to send order notification. Please try again later.');
        // Still close modal but log the error
        modal.style.display = 'none';
      }
    });
  });
});
