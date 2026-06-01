/* Simple Scents - Buy Now direct checkout fix
   1) Upload this file next to index.html
   2) Add this line right before </body> in index.html:
      <script src="buy-now-direct.js"></script>
   3) Replace YOUR_PAYPAL_CHECKOUT_LINK below with your real PayPal checkout/payment link.
*/

const DIRECT_CHECKOUT_LINK = "https://www.paypal.com/";

function getCurrentProductName() {
  const possibleTitle = document.querySelector("h1, .product-title, .details-title, .item-title");
  return possibleTitle ? possibleTitle.textContent.trim() : "Simple Scents fragrance sample";
}

function getCurrentProductPrice() {
  const possiblePrice = document.querySelector(".price, .product-price, [data-price]");
  return possiblePrice ? possiblePrice.textContent.trim() : "";
}

function openDirectCheckout() {
  const product = encodeURIComponent(getCurrentProductName());
  const price = encodeURIComponent(getCurrentProductPrice());
  const separator = DIRECT_CHECKOUT_LINK.includes("?") ? "&" : "?";

  window.location.href = `${DIRECT_CHECKOUT_LINK}${separator}item=${product}&price=${price}`;
}

function fixBuyNowButtons() {
  const buttons = Array.from(document.querySelectorAll("button, a"));
  const buyNowButtons = buttons.filter((btn) => btn.textContent.trim().toLowerCase() === "buy now");

  buyNowButtons.forEach((button) => {
    const cleanButton = button.cloneNode(true);
    cleanButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openDirectCheckout();
    }, true);
    button.replaceWith(cleanButton);
  });
}

document.addEventListener("DOMContentLoaded", fixBuyNowButtons);
window.addEventListener("load", fixBuyNowButtons);
