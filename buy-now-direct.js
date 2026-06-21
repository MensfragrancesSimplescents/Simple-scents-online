function simpleScentsCorrectPrice(item) {
  const name = String(item.name || item.title || "").toLowerCase();
  if (name.includes("le male le parfum")) return 7.99;
  if (name.includes("le male") && !name.includes("le parfum")) return 6.99;
  return parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
}
function simpleScentsCorrectPriceText(item) {
  return "$" + simpleScentsCorrectPrice(item).toFixed(2);
}

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
  const item = {
    name: getCurrentProductName(),
    price: simpleScentsCorrectPrice({ name: getCurrentProductName(), price: getCurrentProductPrice() }).toFixed(2)
  };

  localStorage.setItem("buyNowItem", JSON.stringify(item));
  window.location.href = "checkout-square.html";
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
