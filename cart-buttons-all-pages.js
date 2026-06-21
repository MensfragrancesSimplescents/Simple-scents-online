// Simple Scents cart buttons + 1 mL / 2 mL size selector
(function () {
  const path = window.location.pathname.toLowerCase();
  const file = path.split('/').pop();

  // Do NOT show Add to Cart / Buy Now on homepage or cart page
  if (file === '' || file === 'index.html' || file === 'cart.html' || file === 'checkout-square.html' || path.endsWith('/')) {
    return;
  }

  const PRICE_MAP = [
    { keys: ['jpg le male le parfum'], one: 4.49, two: 7.99 },
    { keys: ['jpg le male edt', 'jpg le male'], one: 3.49, two: 6.99 },
    { keys: ['jpg le beau edt', 'jpg le beau'], one: 4.49, two: 6.49 },
    { keys: ['pacific rock moss', 'goldfield banks pacific rock moss'], one: 4.99, two: 7.49 },
    { keys: ['acqua di gio profondo edp', 'acqua di gio profondo'], one: 3.99, two: 6.49 },
    { keys: ['ysl myslf edp', 'ysl myself edp', 'ysl myself'], one: 4.99, two: 6.99 },
    { keys: ['prada luna rossa ocean', 'prada ocean'], one: 3.99, two: 5.99 },
    { keys: ['aromatic citrus pour homme', 'aromatic citrus'], one: 1.99, two: 3.99 },
    { keys: ['versace eros flame', 'eros flame'], one: 4.49, two: 6.49 },
    { keys: ['invictus edt', 'invictus'], one: 3.49, two: 5.49 },
    { keys: ['paco rabanne 1 million edt', '1 million edt', 'one million'], one: 3.49, two: 4.99 },
    { keys: ['afnan 9pm', '9pm'], one: 2.99, two: 4.99 },
    { keys: ['mancera instant crush', 'instant crush'], one: 4.99, two: 7.99 },
    { keys: ['cremo spice black vanilla', 'cremo spice and black vanilla', 'cremo spice & black vanilla'], one: 2.49, two: 3.99 },
    { keys: ['nautica voyage'], one: 2.49, two: 3.99 },
    { keys: ['guess seductive homme'], one: 2.49, two: 3.99 },
    { keys: ['armaf ventana pour homme', 'armaf ventana'], one: 2.49, two: 4.49 }
  ];



  const SQUARE_LINKS = [
    { keys: ['prada luna rossa ocean', 'prada ocean'], one: 'https://square.link/u/buPnGvip', two: 'https://square.link/u/yZkcB0i8' },
    { keys: ['acqua di gio profondo edp', 'acqua di gio profondo', 'aqua di gio profondo', 'aqua de gio profondo', 'acqua geo profondo', 'aqua geo profondo'], one: 'https://square.link/u/pDDGO7sW', two: 'https://square.link/u/wAd4I8UD' },
    { keys: ['afnan 9pm', '9pm'], one: 'https://square.link/u/6KWNznZY', two: 'https://square.link/u/cBtv4SZA' },
    { keys: ['armaf ventana pour homme', 'armaf ventana'], one: 'https://square.link/u/Nm5h7bZJ', two: 'https://square.link/u/AcU2KGAr' },
    { keys: ['aromatic citrus pour homme', 'aromatic citrus'], one: 'https://square.link/u/crwt7B6A', two: 'https://square.link/u/IMkUl9GB' },
    { keys: ['cremo spice black vanilla', 'cremo spice and black vanilla', 'cremo spice & black vanilla'], one: 'https://square.link/u/OVkHLAQP', two: 'https://square.link/u/QgmcQcdk' },
    { keys: ['guess seductive homme'], one: 'https://square.link/u/dqLsq39O', two: 'https://square.link/u/mWEmMUUj' },
    { keys: ['invictus edt', 'invictus'], one: 'https://square.link/u/6IYkEL6D', two: 'https://square.link/u/gc8eDcmp' },
    { keys: ['jpg le beau edt', 'jpg le beau'], one: 'https://square.link/u/pSJSc6Up', two: 'https://square.link/u/aqT1NUxy' },
    { keys: ['jpg le male le parfum'], one: 'https://square.link/u/B0UfEWG3', two: 'https://square.link/u/erbxB7qj' },
    { keys: ['jpg le male edt', 'jpg le male'], one: 'https://square.link/u/forYE1pR', two: 'https://square.link/u/6BFJEczt' },
    { keys: ['mancera instant crush', 'instant crush'], one: 'https://square.link/u/ynoh8sUM', two: 'https://square.link/u/WQFo5fzE' },
    { keys: ['nautica voyage'], one: 'https://square.link/u/grdqe0bB', two: 'https://square.link/u/9PDmNgnx' },
    { keys: ['pacific rock moss', 'goldfield banks pacific rock moss'], one: 'https://square.link/u/ObsdJ1PE', two: 'https://square.link/u/Coqo3qps' },
    { keys: ['paco rabanne 1 million edt', '1 million edt', 'one million'], one: 'https://square.link/u/tlrbQisJ', two: 'https://square.link/u/6NVnCXkp' },
    { keys: ['versace eros flame', 'eros flame'], one: 'https://square.link/u/wF47g4Dx', two: 'https://square.link/u/zM75zY0e' },
    { keys: ['ysl myslf edp', 'ysl myself edp', 'ysl myself'], one: 'https://square.link/u/5YT3Iv35', two: 'https://square.link/u/kDzc3ExJ' }
  ];



  function normalizeSquareUrl(url) {
    url = String(url || '').trim();
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    // Fix old saved cart/buy-now items that only stored the Square code like wAd4I8UD.
    if (/^[A-Za-z0-9]+$/.test(url)) return 'https://square.link/u/' + url;
    if (url.startsWith('/u/')) return 'https://square.link' + url;
    return url;
  }

  function squareLinkForProduct() {
    // Hard fix for Acqua/Aqua Di Gio Profondo so Safari never opens the bare code as a download.
    if ((titleClean.includes('acqua') || titleClean.includes('aqua')) && titleClean.includes('gio') && titleClean.includes('profondo')) {
      return /^1/.test(String(selectedSize).trim()) ? 'https://square.link/u/pDDGO7sW' : 'https://square.link/u/wAd4I8UD';
    }
    const match = SQUARE_LINKS.find(row => row.keys.some(k => titleClean.includes(clean(k))));
    if (!match) return null;
    return normalizeSquareUrl(/^1/.test(String(selectedSize).trim()) ? match.one : match.two);
  }

  function clean(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function money(num) {
    return '$' + Number(num).toFixed(2);
  }

  function getProductName() {
    const titleEl =
      document.querySelector('.product-title') ||
      document.querySelector('main h1') ||
      document.querySelector('body > h1');

    let name = titleEl?.innerText?.trim().replace(/\s+/g, ' ');

    if (!name || name.toLowerCase() === 'simple scents') {
      name = (document.title || '')
        .replace('| Simple Scents', '')
        .replace('- Simple Scents', '')
        .trim();
    }

    return name || 'Fragrance Sample';
  }

  const title = getProductName();
  const titleClean = clean(title);

  function pricesForProduct() {
    const match = PRICE_MAP.find(row => row.keys.some(k => titleClean.includes(clean(k))));
    if (match) return { one: match.one, two: match.two };

    const pagePriceText = Array.from(document.querySelectorAll('p,div,span,h2,h3'))
      .map(el => el.innerText || '')
      .find(text => /\$\d/.test(text) && /2\s*ml/i.test(text));
    const found = pagePriceText && pagePriceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    const two = found ? Number(found[1]) : 3.99;
    return { one: Math.max(1.99, Math.round((two * 0.58) * 100) / 100), two };
  }

  const prices = pricesForProduct();
  let selectedSize = '2 mL';
  let selectedPrice = prices.two;

  function findMainPriceElement() {
    const candidates = Array.from(document.querySelectorAll('p,div,span,h2,h3'));
    return candidates.find(el => {
      const text = el.innerText || '';
      return /\$\d/.test(text) && /\b(1|2)\s*ml\b/i.test(text) && /sample/i.test(text);
    }) || candidates.find(el => /\$\d/.test(el.innerText || ''));
  }

  function updateDisplayedPrice() {
    const priceEl = findMainPriceElement();
    if (priceEl) {
      priceEl.innerText = `${money(selectedPrice)} · ${selectedSize} sample`;
    }
  }

  function setSelectedSize(size, price) {
    selectedSize = size;
    selectedPrice = Number(price);
    localStorage.setItem('simpleScentsSelectedSize', selectedSize);
    localStorage.setItem('simpleScentsSelectedPrice', String(selectedPrice));
    document.body.dataset.selectedSize = selectedSize;
    document.body.dataset.selectedPrice = String(selectedPrice);
    updateDisplayedPrice();
  }

  function installSizeSelector() {
    if (document.querySelector('.ss-size-box')) {
      updateDisplayedPrice();
      return;
    }

    const style = document.createElement('style');
    style.innerHTML = `
      body { padding-bottom: 115px !important; }
      .ss-size-box {
        width: min(92%, 640px);
        margin: 18px auto 24px;
        padding: 22px 24px;
        border: 1px solid rgba(255,255,255,0.22);
        border-radius: 28px;
        background: #000;
        color: #fff;
        text-align: center;
        box-sizing: border-box;
      }
      .ss-size-title {
        font-size: 28px;
        font-weight: 900;
        margin-bottom: 20px;
      }
      .ss-size-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }
      .ss-size-option {
        border: 2px solid #fff;
        border-radius: 999px;
        background: #fff;
        color: #000;
        min-height: 86px;
        padding: 12px 10px;
        font-size: 28px;
        font-weight: 900;
        line-height: 1.1;
        cursor: pointer;
      }
      .ss-size-option.ss-active {
        background: #fff;
        color: #000;
        outline: 5px solid rgba(255,255,255,0.55);
        box-shadow: inset 0 0 0 4px #000;
      }
      .ss-size-note {
        margin-top: 22px;
        font-size: 22px;
        line-height: 1.3;
        color: rgba(255,255,255,0.78);
        font-weight: 600;
      }
      @media (max-width: 480px) {
        .ss-size-box { width: 90%; padding: 20px 24px; }
        .ss-size-title { font-size: 18px; margin-bottom: 18px; }
        .ss-size-buttons { gap: 14px; }
        .ss-size-option { min-height: 58px; font-size: 16px; }
        .ss-size-note { font-size: 15px; margin-top: 18px; }
      }
    `;
    document.head.appendChild(style);

    const box = document.createElement('div');
    box.className = 'ss-size-box';
    box.innerHTML = `
      <div class="ss-size-title">Choose sample size</div>
      <div class="ss-size-buttons">
        <button type="button" class="ss-size-option" data-size="1 mL" data-price="${prices.one}">1 mL · ${money(prices.one)}</button>
        <button type="button" class="ss-size-option ss-active" data-size="2 mL" data-price="${prices.two}">2 mL · ${money(prices.two)}</button>
      </div>
      <div class="ss-size-note">Pick a size before buying or adding to cart.</div>
    `;

    const swipeHint = Array.from(document.querySelectorAll('p,div,span'))
      .find(el => /swipe/i.test(el.innerText || '') && /photo|image|left|right/i.test(el.innerText || ''));

    if (swipeHint) {
      swipeHint.insertAdjacentElement('afterend', box);
    } else {
      const gallery = document.querySelector('img')?.parentElement;
      if (gallery) gallery.insertAdjacentElement('afterend', box);
      else document.body.insertBefore(box, document.body.firstChild);
    }

    box.querySelectorAll('.ss-size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        box.querySelectorAll('.ss-size-option').forEach(b => b.classList.remove('ss-active'));
        btn.classList.add('ss-active');
        setSelectedSize(btn.dataset.size, btn.dataset.price);
      });
    });

    setSelectedSize('2 mL', prices.two);
  }

  let cart = JSON.parse(localStorage.getItem('simpleScentsCart') || '[]');

  function saveCart() {
    localStorage.setItem('simpleScentsCart', JSON.stringify(cart));
  }

  function sameProduct(a, b) {
    return String(a.name || '').trim().toLowerCase() === String(b.name || '').trim().toLowerCase() &&
      String(a.size || '').trim().toLowerCase() === String(b.size || '').trim().toLowerCase();
  }

  function currentProduct() {
    return {
      name: title,
      price: selectedPrice.toFixed(2),
      size: selectedSize + ' sample',
      page: window.location.pathname,
      squareUrl: squareLinkForProduct(),
      qty: 1
    };
  }

  function addToCart() {
    const product = currentProduct();
    const existingItem = cart.find(item => sameProduct(item, product));

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
      existingItem.price = product.price;
      existingItem.size = product.size;
      existingItem.page = product.page;
    } else {
      cart.push(product);
    }

    saveCart();
    alert(`${title} ${selectedSize} added to cart.`);
  }

  function buyNow(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const product = currentProduct();
    if (!product.squareUrl) {
      alert('Square checkout link is missing for this fragrance.');
      return;
    }

    localStorage.setItem('checkoutMode', 'buyNow');
    localStorage.setItem('buyNowItem', JSON.stringify(product));
    window.location.href = 'checkout-square.html';
  }

  if (document.querySelector('.ss-bottom-bar')) return;

  const bottomStyle = document.createElement('style');
  bottomStyle.innerHTML = `
    .ss-bottom-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
      background: rgba(0, 0, 0, 0.94);
      backdrop-filter: blur(12px);
      border-top: 1px solid rgba(255,255,255,0.15);
      padding: 12px 14px 22px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      box-sizing: border-box;
    }
    .ss-bottom-bar button {
      border: none;
      border-radius: 999px;
      padding: 16px 12px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
    }
    .ss-add {
      background: #222;
      color: white;
      border: 1px solid rgba(255,255,255,0.25) !important;
    }
    .ss-buy {
      background: white;
      color: black;
    }
  `;
  document.head.appendChild(bottomStyle);

  installSizeSelector();

  const bar = document.createElement('div');
  bar.className = 'ss-bottom-bar';

  const addBtn = document.createElement('button');
  addBtn.className = 'ss-add';
  addBtn.innerText = 'Add to Cart';
  addBtn.onclick = addToCart;

  const buyBtn = document.createElement('button');
  buyBtn.className = 'ss-buy';
  buyBtn.innerText = 'Pay Now';
  buyBtn.addEventListener('click', buyNow);

  bar.appendChild(addBtn);
  bar.appendChild(buyBtn);
  document.body.appendChild(bar);
})();
