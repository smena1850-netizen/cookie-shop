/* ================================
   COOKIE HOUSE – MAIN JAVASCRIPT
   ================================ */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

// ===== FILTER TABS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    productCards.forEach((card, index) => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animationDelay = `${index * 0.05}s`;
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CART STATE =====
let cart = [];

function getItemIndex(name) {
  return cart.findIndex(item => item.name === name);
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = total;
  if (total > 0) {
    countEl.classList.add('visible');
  } else {
    countEl.classList.remove('visible');
  }
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById('cartTotal').textContent = `${total} جنيه`;
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <span>🍪</span>
        <p>سلتك فاضية!</p>
        <a href="#menu" onclick="closeCart()" class="btn-primary">اطلب دلوقتي</a>
      </div>
    `;
    cartFooter.style.display = 'none';
    return;
  }

  cartFooter.style.display = 'block';

  cartItemsEl.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <span class="cart-item-emoji">🍪</span>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>${item.price} جنيه × ${item.qty} = ${item.price * item.qty} جنيه</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
      </div>
    </div>
  `).join('');

  updateCartTotal();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
  updateCartCount();
}

// ===== ADD TO CART =====
function addToCart(btn, name, price) {
  const existing = getItemIndex(name);

  if (existing >= 0) {
    cart[existing].qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  updateCartCount();
  showToast(`✅ تمت إضافة "${name}" للسلة!`);

  // Animate button
  btn.textContent = '✓ أضيف!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = 'أضف +';
    btn.style.background = '';
  }, 1200);
}

// ===== CART DRAWER =====
function openCart() {
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCart();
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = cart.map(item => `${item.name} ×${item.qty}`).join(', ');

  alert(`🎉 شكراً لطلبك!\n\nالمنتجات: ${items}\nالمجموع: ${total} جنيه\n\nسيتم التواصل معك قريباً لتأكيد الطلب! 💛`);

  cart = [];
  updateCartCount();
  renderCart();
  closeCart();
}

// ===== TOAST NOTIFICATION =====
let toastTimeout;

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ===== CONTACT FORM =====
function handleSubmit(event) {
  event.preventDefault();
  const successEl = document.getElementById('formSuccess');
  successEl.style.display = 'block';
  event.target.reset();

  setTimeout(() => {
    successEl.style.display = 'none';
  }, 5000);
}

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply to sections
document.querySelectorAll('.stat, .feature, .testimonial-card, .gallery-item, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== INIT =====
console.log('🍪 كوكي هاوس – Welcome! Cookie House is ready!');
