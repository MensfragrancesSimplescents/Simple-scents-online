(function () {
  if (document.querySelector('a[href="versace-eros-flame.html"]')) return;
  const card = document.createElement("a");
  card.href = "versace-eros-flame.html";
  card.className = "card";
  card.innerHTML = `
    <img src="eros-flame-handheld.jpg" alt="Versace Eros Flame 2ml sample">
    <h3>Versace Eros Flame</h3>
    <p>$6.49 · 2ml sample<br>$3.99 · 1ml sample</p>
    <p>Orange, lemon, black pepper, rosemary, vanilla, tonka, and warm woods.</p>
  `;
  const grid = document.querySelector(".products .grid, .grid, .products");
  if (grid) grid.appendChild(card);
})();
