document.addEventListener('click', function(e) {
  const btn = e.target.closest('button,a');
  if (!btn) return;
  const t = (btn.textContent || '').toLowerCase().trim();

  // Product page Buy Now is handled by cart-buttons-all-pages.js so it can save the item.
  if (t.includes('buy now')) return;

  // Cart checkout should use the full cart, not an old Buy Now item.
  if (t.includes('checkout')) {
    e.preventDefault();
    localStorage.removeItem('simpleScentsBuyNow');
    window.location.href = 'checkout.html';
  }
});
