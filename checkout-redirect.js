function simpleScentsCorrectPrice(item) {
  const name = String(item.name || item.title || "").toLowerCase();
  if (name.includes("le male le parfum")) return 7.99;
  if (name.includes("le male") && !name.includes("le parfum")) return 6.99;
  return parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
}
function simpleScentsCorrectPriceText(item) {
  return "$" + simpleScentsCorrectPrice(item).toFixed(2);
}

document.addEventListener('click', function(e) {
  const btn = e.target.closest('button,a');
  if (!btn) return;

  const t = (btn.textContent || '').toLowerCase();

  if (t.includes('buy now')) {
    const titleEl = document.querySelector('.product-title') || document.querySelector('main h1') || document.querySelector('body > h1');
    const priceEl = document.querySelector('.price') || document.querySelector('[class*="price"]');
    const name = titleEl ? titleEl.textContent.trim() : 'Fragrance Sample';
    const priceText = priceEl ? priceEl.textContent.trim() : '$0.00';
    const match = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    let price = match ? match[1] : '0.00';
    price = simpleScentsCorrectPrice({ name, price }).toFixed(2);

    localStorage.setItem('checkoutMode', 'buyNow');
    localStorage.setItem('buyNowItem', JSON.stringify({ name, price, size: '2ml sample', page: window.location.pathname, qty: 1 }));
    e.preventDefault();
    window.location.href = 'checkout.html';
    return;
  }

  if (t.includes('checkout')) {
    localStorage.setItem('checkoutMode', 'cart');
    localStorage.removeItem('buyNowItem');
    e.preventDefault();
    window.location.href = 'checkout.html';
  }
});
