// Upload this file, then add this line before </body> in index.html:
// <script src="add-eros-flame-card.js"></script>
(function () {
  if (document.querySelector('a[href="versace-eros-flame.html"]')) return;

  const card = document.createElement("a");
  card.href = "versace-eros-flame.html";
  card.className = "product-card";
  card.innerHTML = `
    <img src="images/versace-eros-flame-handheld.jpg" alt="Versace Eros Flame 2ml sample">
    <h2>Versace Eros Flame</h2>
    <p>$6.49 • 2ml sample</p>
  `;

  const grid = document.querySelector(".products, .product-grid, .grid, main");
  if (grid) grid.appendChild(card);
})();
