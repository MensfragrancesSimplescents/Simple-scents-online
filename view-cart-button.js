// Simple Scents View Cart header button
// Upload this as: view-cart-button.js
// Add this before </body> in index.html:
// <script src="view-cart-button.js"></script>

(function () {
  const links = Array.from(document.querySelectorAll("a, button"));
  const shopButton = links.find(el => el.innerText && el.innerText.trim().toLowerCase() === "shop");

  if (shopButton) {
    shopButton.innerText = "View Cart";
    if (shopButton.tagName.toLowerCase() === "a") {
      shopButton.href = "cart.html";
    } else {
      shopButton.onclick = function () {
        window.location.href = "cart.html";
      };
    }
  }
})();
