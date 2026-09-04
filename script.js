gsap.registerPlugin(ScrollTrigger);

  /* ── Preloader ─────────────────────────────── */
  let pct = 0;
  const counter = document.getElementById('pl-counter');
  const ticker = setInterval(() => {
    pct += Math.random() * 14;
    if (pct >= 100) { pct = 100; clearInterval(ticker); }
    counter.textContent = Math.floor(pct) + '%';
  }, 100);

  window.addEventListener('load', () => {
    setTimeout(() => {
      gsap.to('#preloader', {
        opacity: 0, duration: .9, ease: 'power2.inOut',
        onComplete() {
          document.getElementById('preloader').style.display = 'none';
          heroIn();
        }
      });
    }, 2200);
  });

  /* ── Hero entrance ─────────────────────────── */
  function heroIn() {
    const tl = gsap.timeline();
    tl.to('#heyebrow',       { opacity: 1, y: 0, duration: .7, ease: 'power3.out' })
      .to(['#hl1','#hl2','#hl3'], { y: '0%', duration: .95, ease: 'power4.out', stagger: .13 }, '-=.3')
      .to('#hsub',           { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.45')
      .to('#hcta',           { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, '-=.45')
      .to('#hvisual',        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }, '-=.8')
      .to('#hscroll',        { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, '-=.5');

    setTimeout(() => document.getElementById('hvisual').classList.add('loaded'), 2000);
  }

  /* — Custom Cursor — */

if (window.matchMedia('(pointer: fine)').matches) {

  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  function raf() {
    rx += (mx - rx) * .11;
    ry += (my - ry) * .11;

    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';

    requestAnimationFrame(raf);
  }

  raf();

  document.querySelectorAll('a,button,.product-card').forEach(el => {

    el.addEventListener('mouseenter', () => {
      cur.style.width = cur.style.height = '18px';
      ring.style.width = ring.style.height = '50px';
    });

    el.addEventListener('mouseleave', () => {
      cur.style.width = cur.style.height = '10px';
      ring.style.width = ring.style.height = '38px';
    });

  });

}

  /* ── Scroll Reveal ─────────────────────────── */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* ── Stats Counter ─────────────────────────── */
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.target);
      const suf = el.dataset.suffix || '';
      let  val  = 0;
      const dur  = 1800;
      const step = end / (dur / 16);
      const t = setInterval(() => {
        val = Math.min(val + step, end);
        el.textContent = Math.floor(val) + suf;
        if (val >= end) clearInterval(t);
      }, 16);
      statObs.unobserve(el);
    });
  }, { threshold: .5 });
  document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

  /* ── Navbar on Scroll ─────────────────────── */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.getElementById('nav').classList.toggle('scrolled', y > 60);
    document.getElementById('scroll-top').classList.toggle('show', y > 500);
  });

  /* ── Testimonials ─────────────────────────── */
  let tIdx = 0;
  const tTrack = document.getElementById('ttrack');
  const tDots  = document.querySelectorAll('.test-dot');

  function goToSlide(i) {
    tIdx = i;
    const cw = tTrack.children[0].offsetWidth + 32;
    tTrack.style.transform = `translateX(-${tIdx * cw}px)`;
    tDots.forEach((d, j) => d.classList.toggle('active', j === tIdx));
  }

  document.getElementById('tnext').addEventListener('click', () => {
    goToSlide(tIdx < tTrack.children.length - 2 ? tIdx + 1 : 0);
  });
  document.getElementById('tprev').addEventListener('click', () => {
    goToSlide(tIdx > 0 ? tIdx - 1 : tTrack.children.length - 2);
  });

  // Auto-play
  setInterval(() => {
    goToSlide(tIdx < tTrack.children.length - 2 ? tIdx + 1 : 0);
  }, 5000);

  /* ── Cart ─────────────────────────────────── */

let cart = JSON.parse(localStorage.getItem('aurum-cart')) || [];


/* Get product information from the card */

function getProductFromCard(btn) {
  const card = btn.closest('.product-card');

  return {
    name: card.querySelector('.p-name').textContent.trim(),
    category: card.querySelector('.p-cat').textContent.trim(),
    price: parseInt(
      card.querySelector('.p-price').textContent.replace(/[$,]/g, '')
    ),
    glyph: card.querySelector('.p-glyph').textContent.trim()
  };
}


/* Save cart */

function saveCart() {
  localStorage.setItem('aurum-cart', JSON.stringify(cart));
}


/* Format price */

function formatPrice(price) {
  return '$' + price.toLocaleString('en-IN');
}


/* Update cart count + cart contents */

function updateCartUI() {

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById('cart-badge').textContent = totalItems;
  document.getElementById('nav-cart').textContent = `Cart (${totalItems})`;

  const itemsContainer = document.getElementById('cart-items');
  const emptyCart = document.getElementById('cart-empty');

  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    emptyCart.style.display = 'flex';
  } else {
    emptyCart.style.display = 'none';

    cart.forEach((item, index) => {

      const itemHTML = document.createElement('div');

      itemHTML.className = 'cart-item';

      itemHTML.innerHTML = `
        <div class="cart-item-image">
          <span>${item.glyph}</span>
        </div>

        <div class="cart-item-info">
          <div class="cart-item-category">
            ${item.category}
          </div>

          <div class="cart-item-name">
            ${item.name}
          </div>

          <div class="cart-item-price">
            ${formatPrice(item.price)}
          </div>

          <div class="cart-quantity">
            <button onclick="changeQuantity(${index}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>

        <button
          class="cart-remove"
          onclick="removeFromCart(${index})">
          Remove
        </button>
      `;

      itemsContainer.appendChild(itemHTML);
    });
  }


  /* Calculate subtotal */

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  document.getElementById('cart-subtotal').textContent =
    formatPrice(subtotal);
}


/* Add product */

function addToCart(btn) {

  const product = getProductFromCard(btn);

  const existingItem = cart.find(
    item => item.name === product.name
  );

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();

  /* Open cart */

  openCart();


  /* Button feedback */

  const originalText = btn.textContent;

  btn.textContent = '✓ Added';
  btn.style.background = '#5a8a5a';

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1200);


  /* Floating cart pulse */

  gsap.fromTo(
    '#floating-cart',
    { scale: 1 },
    {
      scale: 1.25,
      duration: .15,
      yoyo: true,
      repeat: 1
    }
  );
}


/* Change quantity */

function changeQuantity(index, amount) {

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
}


/* Remove product */

function removeFromCart(index) {

  cart.splice(index, 1);

  saveCart();
  updateCartUI();
}


/* Open cart */

function openCart() {

  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');

  document.body.style.overflow = 'hidden';
}


/* Close cart */

function closeCart() {

  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');

  document.body.style.overflow = '';
}


/* Cart buttons */

document.getElementById('nav-cart').addEventListener(
  'click',
  openCart
);

document.getElementById('floating-cart').addEventListener(
  'click',
  openCart
);

document.getElementById('cart-close').addEventListener(
  'click',
  closeCart
);

document.getElementById('cart-overlay').addEventListener(
  'click',
  closeCart
);

document.getElementById('cart-continue').addEventListener(
  'click',
  closeCart
);


/* Escape key closes cart */

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeCart();
  }

});


/* ── Checkout ─────────────────────────────── */

const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutClose = document.getElementById('checkout-close');
const checkoutButton = document.getElementById('cart-checkout');

function openCheckout() {

  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  closeCart();

  const checkoutTotal = document.getElementById('checkout-total');

  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  checkoutTotal.textContent = formatPrice(total);

  checkoutOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  checkoutOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

checkoutButton.addEventListener('click', openCheckout);

checkoutClose.addEventListener('click', closeCheckout);

checkoutOverlay.addEventListener('click', e => {
  if (e.target === checkoutOverlay) {
    closeCheckout();
  }
});

const placeOrderButton = document.getElementById('place-order');

placeOrderButton.addEventListener('click', () => {

  const name = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const city = document.getElementById('checkout-city').value.trim();
  const pincode = document.getElementById('checkout-pincode').value.trim();

  // Clear previous errors
  document.querySelectorAll('.checkout-error').forEach(error => {
    error.textContent = '';
  });

  let isValid = true;

  // Name
  if (name.length < 2) {
    document.getElementById('name-error').textContent =
      'Please enter your full name.';
    isValid = false;
  }

  // Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    document.getElementById('email-error').textContent =
      'Please enter a valid email address.';
    isValid = false;
  }

  // Address
  if (address.length < 5) {
    document.getElementById('address-error').textContent =
      'Please enter your complete address.';
    isValid = false;
  }

  // City
  if (city.length < 2) {
    document.getElementById('city-error').textContent =
      'Please enter your city.';
    isValid = false;
  }

  // PIN
  const pinPattern = /^\d{6}$/;

  if (!pinPattern.test(pincode)) {
    document.getElementById('pincode-error').textContent =
      'Please enter a valid 6-digit PIN code.';
    isValid = false;
  }

  if (!isValid) {
  return;
}

openConfirmation();

cart = [];
saveCart();
updateCartUI();
});

const confirmationOverlay =
  document.getElementById('confirmation-overlay');

const confirmationClose =
  document.getElementById('confirmation-close');

const continueShopping =
  document.getElementById('continue-shopping');


function generateOrderId() {
  const number = Math.floor(100000 + Math.random() * 900000);

  return `AUR-${number}`;
}


function openConfirmation() {

  const confirmationItems =
    document.getElementById('confirmation-items');

  const confirmationTotal =
    document.getElementById('confirmation-total');

  const confirmationOrderId =
    document.getElementById('confirmation-order-id');


  confirmationOrderId.textContent = generateOrderId();

  confirmationItems.innerHTML = '';


  cart.forEach(item => {

    const itemTotal =
      item.price * item.quantity;

    const confirmationItem =
      document.createElement('div');

    confirmationItem.className =
      'checkout-item';

    confirmationItem.innerHTML = `
      <div class="checkout-item-info">

        <div class="checkout-item-name">
          ${item.name}
        </div>

        <div class="checkout-item-meta">
          ${item.category} · Qty ${item.quantity}
        </div>

      </div>

      <div class="checkout-item-price">
        ${formatPrice(itemTotal)}
      </div>
    `;

    confirmationItems.appendChild(
      confirmationItem
    );
  });


  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);


  confirmationTotal.textContent =
    formatPrice(total);


  confirmationOverlay.classList.add('open');

  document.body.style.overflow = 'hidden';
}


function closeConfirmation() {

  confirmationOverlay.classList.remove('open');

  document.body.style.overflow = '';
}


confirmationClose.addEventListener(
  'click',
  closeConfirmation
);


continueShopping.addEventListener(
  'click',
  () => {

    closeConfirmation();
    closeCheckout();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }
);


/* ── Wishlist ─────────────────────────────── */

let wishlist = JSON.parse(
  localStorage.getItem('aurum-wishlist')
) || [];


function toggleWish(btn) {

  const card = btn.closest('.product-card');

  const productName =
    card.querySelector('.p-name').textContent.trim();


  btn.classList.toggle('loved');


  const isLoved =
    btn.classList.contains('loved');


  btn.textContent =
    isLoved ? '♥' : '♡';


  if (isLoved) {

    wishlist.push(productName);

  } else {

    wishlist = wishlist.filter(
      name => name !== productName
    );

  }


  localStorage.setItem(
    'aurum-wishlist',
    JSON.stringify(wishlist)
  );
}


/* Restore cart after page refresh */

updateCartUI();

/* Restore wishlist after page refresh */

document.querySelectorAll('.p-wish').forEach(button => {

  const card = button.closest('.product-card');

  if (!card) return;

  const productName =
    card.querySelector('.p-name').textContent.trim();

  if (wishlist.includes(productName)) {

    button.classList.add('loved');

    button.textContent = '♥';

  }

});

  /* ── Newsletter ───────────────────────────── */
  function subscribe() {
    const inp = document.getElementById('nl-email');
    if (!inp.value.includes('@')) {
      inp.style.borderColor = '#a04040';
      setTimeout(() => inp.style.borderColor = '', 1000);
      return;
    }
    inp.value = '';
    inp.placeholder = '✦  Welcome to the inner circle';
    inp.style.borderColor = 'var(--gold)';
    setTimeout(() => {
      inp.placeholder = 'Your email address…';
      inp.style.borderColor = '';
    }, 3500);
  }

  /* ── Smooth Anchor Scroll ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── GSAP Parallax on Hero ─────────────────── */
  gsap.to('.hero-glow', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-content', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

/* ── Search ───────────────────────────────── */

const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchButton = document.getElementById('nav-search');
const searchClose = document.getElementById('search-close');


/* Open search */

function openSearch() {
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    searchInput.focus();
  }, 400);
}


/* Close search */

function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
  searchInput.value = '';

  showSearchHint();
}


/* Initial message */

function showSearchHint() {
  searchResults.innerHTML = `
    <p class="search-hint">
      Begin typing to explore the collection.
    </p>
  `;
}


/* Search products */

function searchProducts() {

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    showSearchHint();
    return;
  }

  const products = document.querySelectorAll('.product-card');

  const matches = [...products].filter(card => {

    const name =
      card.querySelector('.p-name').textContent.toLowerCase();

    const category =
      card.querySelector('.p-cat').textContent.toLowerCase();

    return name.includes(query) || category.includes(query);
  });


  /* No results */

  if (matches.length === 0) {

    searchResults.innerHTML = `
      <p class="search-hint">
        No pieces found for "${searchInput.value}".
      </p>
    `;

    return;
  }


  /* Display results */

  searchResults.innerHTML = '';

  matches.forEach(card => {

  const name =
    card.querySelector('.p-name').textContent.trim();

  const category =
    card.querySelector('.p-cat').textContent.trim();

  const price =
    card.querySelector('.p-price').textContent.trim();

  const glyph =
    card.querySelector('.p-glyph').textContent.trim();


  const result = document.createElement('div');

  result.className = 'search-result';

  result.innerHTML = `
    <div class="search-result-info">

      <div class="search-result-glyph">
        ${glyph}
      </div>

      <div>
        <div class="search-result-category">
          ${category}
        </div>

        <div class="search-result-name">
          ${name}
        </div>
      </div>

    </div>

    <div class="search-result-price">
      ${price}
    </div>
  `;


  /* Click result → go to product */

  result.addEventListener('click', () => {

    closeSearch();

    setTimeout(() => {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      card.style.borderColor = 'var(--gold)';

      setTimeout(() => {
        card.style.borderColor = '';
      }, 1500);

    }, 400);

  });


  searchResults.appendChild(result);

});
}


/* Search events */

searchButton.addEventListener('click', openSearch);

searchClose.addEventListener('click', closeSearch);

searchInput.addEventListener('input', searchProducts);


/* Escape closes search */

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeSearch();
  }

});

/* ── Account ─────────────────────────────── */

const accountOverlay =
  document.getElementById('account-overlay');

const accountButton =
  document.getElementById('nav-account');

const accountClose =
  document.getElementById('account-close');


function openAccount() {

  accountOverlay.classList.add('open');

  document.body.style.overflow = 'hidden';
}


function closeAccount() {

  accountOverlay.classList.remove('open');

  document.body.style.overflow = '';
}


accountButton.addEventListener(
  'click',
  openAccount
);


accountClose.addEventListener(
  'click',
  closeAccount
);


accountOverlay.addEventListener('click', e => {

  if (e.target === accountOverlay) {
    closeAccount();
  }

});


document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeAccount();
  }

});

/* ── Account Tabs ─────────────────────────── */

const accountTabs =
  document.querySelectorAll('.account-tab');

const loginForm =
  document.getElementById('login-form');

const signupForm =
  document.getElementById('signup-form');


accountTabs.forEach(tab => {

  tab.addEventListener('click', () => {

    const mode = tab.dataset.mode;


    accountTabs.forEach(item => {
      item.classList.remove('active');
    });

    tab.classList.add('active');


    if (mode === 'login') {

      loginForm.style.display = 'block';
      signupForm.style.display = 'none';

    } else {

      loginForm.style.display = 'none';
      signupForm.style.display = 'block';

    }

  });

});

/* ── Account Sign In Validation ───────────── */

loginForm.addEventListener('submit', e => {

  e.preventDefault();

  const email =
    document.getElementById('login-email').value.trim();

  const password =
    document.getElementById('login-password').value;


  document.getElementById('login-email-error').textContent = '';
  document.getElementById('login-password-error').textContent = '';


  let isValid = true;


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!emailPattern.test(email)) {

    document.getElementById('login-email-error').textContent =
      'Please enter a valid email address.';

    isValid = false;
  }


  if (password.length < 6) {

    document.getElementById('login-password-error').textContent =
      'Password must be at least 6 characters.';

    isValid = false;
  }


  if (!isValid) {
    return;
  }

  closeAccount();
});

/* ── Password Show / Hide ───────────────── */

document.querySelectorAll('.password-toggle').forEach(button => {

  button.addEventListener('click', () => {

    const input = document.getElementById(
      button.dataset.target
    );

    if (input.type === 'password') {

      input.type = 'text';

      button.setAttribute(
        'aria-label',
        'Hide password'
      );

      button.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
          <circle cx="12" cy="12" r="2.5"></circle>
          <path d="M4 4L20 20"></path>
        </svg>
      `;

    } else {

      input.type = 'password';

      button.setAttribute(
        'aria-label',
        'Show password'
      );

      button.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
          <circle cx="12" cy="12" r="2.5"></circle>
        </svg>
      `;

    }

  });

});

/* ── Create Account Validation ───────────── */

signupForm.addEventListener('submit', e => {

  e.preventDefault();

  const name =
    document.getElementById('signup-name').value.trim();

  const email =
    document.getElementById('signup-email').value.trim();

  const password =
    document.getElementById('signup-password').value;


  document.getElementById('signup-name-error').textContent = '';
  document.getElementById('signup-email-error').textContent = '';
  document.getElementById('signup-password-error').textContent = '';


  let isValid = true;


  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (name.length < 2) {

    document.getElementById('signup-name-error').textContent =
      'Please enter your full name.';

    isValid = false;
  }


  if (!emailPattern.test(email)) {

    document.getElementById('signup-email-error').textContent =
      'Please enter a valid email address.';

    isValid = false;
  }


  if (password.length < 6) {

    document.getElementById('signup-password-error').textContent =
      'Password must be at least 6 characters.';

    isValid = false;
  }


  if (!isValid) {
    return;
  }


  signupForm.style.display = 'none';

document.querySelector('.account-tabs').style.display = 'none';
document.querySelector('.account-intro').style.display = 'none';
document.getElementById('account-eyebrow').style.display = 'none';
document.getElementById('account-heading').style.display = 'none';

document.getElementById('account-success').style.display = 'block';
});

const accountSuccessClose =
  document.getElementById('account-success-close');

accountSuccessClose.addEventListener('click', () => {

  closeAccount();

  setTimeout(() => {

    document.getElementById('account-success').style.display = 'none';

    document.querySelector('.account-tabs').style.display = 'flex';
    document.querySelector('.account-intro').style.display = 'block';

    document.getElementById('account-eyebrow').style.display = 'block';
    document.getElementById('account-heading').style.display = 'block';

    loginForm.style.display = 'block';
    signupForm.style.display = 'none';

    loginForm.reset();
    signupForm.reset();

    document.getElementById('login-email-error').textContent = '';
    document.getElementById('login-password-error').textContent = '';

    document.getElementById('signup-name-error').textContent = '';
    document.getElementById('signup-email-error').textContent = '';
    document.getElementById('signup-password-error').textContent = '';

    accountTabs.forEach(tab => {
      tab.classList.remove('active');
    });

    accountTabs[0].classList.add('active');

    document.querySelector('#account-success h3').textContent =
      'Your account is ready.';

    document.querySelector('#account-success p').textContent =
      'Your AURUM journey begins here. You can now save pieces and keep track of your orders.';

  }, 400);

});

/* ── Story Overlay ───────────────────────── */

const storyOverlay = document.getElementById('story-overlay');
const storyButton = document.getElementById('read-story');
const storyClose = document.getElementById('story-close');

function openStory() {
  storyOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStory() {
  storyOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

storyButton.addEventListener('click', (e) => {
  e.preventDefault();
  openStory();
});

storyClose.addEventListener('click', closeStory);

storyOverlay.addEventListener('click', (e) => {
  if (e.target === storyOverlay) {
    closeStory();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStory();
  }
});

/* ── Product Detail ───────────────────────── */

const productOverlay =
  document.getElementById('product-overlay');

const productClose =
  document.getElementById('product-close');

const detailGlyph =
  document.getElementById('detail-glyph');

const detailCategory =
  document.getElementById('detail-category');

const detailName =
  document.getElementById('detail-name');

const detailPrice =
  document.getElementById('detail-price');

const detailDescription =
  document.getElementById('detail-description');

const detailAddCart =
  document.getElementById('detail-add-cart');

const detailWish =
  document.getElementById('detail-wish');

let currentProductCard = null;


function openProductDetail(card) {

  currentProductCard = card;

  const name =
    card.querySelector('.p-name').textContent.trim();

  const category =
    card.querySelector('.p-cat').textContent.trim();

  const price =
    card.querySelector('.p-price').textContent.trim();

  const glyph =
    card.querySelector('.p-glyph').textContent.trim();

  detailName.textContent = name;
  detailCategory.textContent = category;
  detailPrice.textContent = price;
  detailGlyph.textContent = glyph;

  const cardWish = card.querySelector('.p-wish');

detailWish.textContent =
  cardWish.classList.contains('loved') ? '♥' : '♡';

detailWish.classList.toggle(
  'loved',
  cardWish.classList.contains('loved')
);

  detailDescription.textContent =
    `A refined ${category.toLowerCase()} piece created with intention, designed to become part of your collection.`;

  productOverlay.classList.add('open');

  document.body.style.overflow = 'hidden';
}

detailAddCart.addEventListener('click', () => {

  if (!currentProductCard) return;

  const card = currentProductCard;
  const cartButton = card.querySelector('.p-overlay-btn');

  closeProductDetail();

  addToCart(cartButton);

});

detailWish.addEventListener('click', () => {

  if (!currentProductCard) return;

  const cardWish =
    currentProductCard.querySelector('.p-wish');

  toggleWish(cardWish);

  detailWish.textContent =
    cardWish.classList.contains('loved') ? '♥' : '♡';

  detailWish.classList.toggle(
    'loved',
    cardWish.classList.contains('loved')
  );

});


function closeProductDetail() {

  productOverlay.classList.remove('open');

  document.body.style.overflow = '';

  currentProductCard = null;
}


/* Close */

productClose.addEventListener(
  'click',
  closeProductDetail
);


productOverlay.addEventListener('click', e => {

  if (e.target === productOverlay) {
    closeProductDetail();
  }

});


document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    closeProductDetail();
  }

});

/* ── Mobile Menu ───────────────────────────── */

const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobileMenuClose.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
});

document.querySelectorAll('.mobile-menu-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});