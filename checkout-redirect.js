
// Keeps checkout buttons going to checkout.html and uses selected 1 mL / 2 mL size for Buy Now.
document.addEventListener('click', function(e) {
  const btn = e.target.closest('button,a');
  if (!btn) return;

  const t = (btn.textContent || '').toLowerCase();

  if (t.includes('buy now')) {
    const titleEl =
      document.querySelector('.product-title') ||
      document.querySelector('main h1') ||
      Array.from(document.querySelectorAll('h1')).find(h => (h.innerText || '').trim().toLowerCase() !== 'simple scents') ||
      document.querySelector('body > h1');

    const priceEl = document.querySelector('.price') || document.querySelector('[class*="price"]');
    const name = titleEl ? titleEl.textContent.trim() : 'Fragrance Sample';
    const priceText = priceEl ? priceEl.textContent.trim() : '$0.00';
    const match = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    const price = match ? match[1] : '0.00';
    const selectedSize = localStorage.getItem("simpleScentsSelectedSize") || "2ml";
    const size = selectedSize === "1ml" ? "1ml sample" : "2ml sample";

    localStorage.setItem('checkoutMode', 'buyNow');
    localStorage.setItem('buyNowItem', JSON.stringify({ name, price, size, page: window.location.pathname, qty: 1 }));
    e.preventDefault();
    
    return;
  }

  if (t.includes('checkout')) {
    localStorage.setItem('checkoutMode', 'cart');
    localStorage.removeItem('buyNowItem');
    e.preventDefault();
    
  }
});
