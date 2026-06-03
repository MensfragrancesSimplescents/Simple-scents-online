
function simpleScentsCorrectPrice(item) {
  const name = String(item.name || item.title || "").toLowerCase();
  if (name.includes("le male le parfum")) return 7.99;
  if (name.includes("le male") && !name.includes("le parfum")) return 6.99;
  return simpleScentsCorrectPrice(item);
}
function simpleScentsCorrectPriceText(item) {
  return "$" + simpleScentsCorrectPrice(item).toFixed(2);
}

// Simple Scents cart buttons - FIXED fragrance names
(function () {
  const path = window.location.pathname.toLowerCase();
  const file = path.split("/").pop();

  // Do NOT show Add to Cart / Buy Now on homepage or cart page
  if (file === "" || file === "index.html" || file === "cart.html" || path.endsWith("/")) {
    return;
  }

  function getProductName() {
    const titleEl =
      document.querySelector(".product-title") ||
      document.querySelector("main h1") ||
      document.querySelector("body > h1");

    let name = titleEl?.innerText?.trim().replace(/\s+/g, " ");

    // If it accidentally grabs the header logo name, use the page title instead
    if (!name || name.toLowerCase() === "simple scents") {
      name = (document.title || "")
        .replace("| Simple Scents", "")
        .replace("- Simple Scents", "")
        .trim();
    }

    return name || "Fragrance Sample";
  }

  const title = getProductName();

  const priceText =
    document.querySelector(".price")?.innerText?.trim() ||
    document.querySelector('[class*="price"]')?.innerText?.trim() ||
    "$3.99 • 2ml sample";

  const priceMatch = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
  const price = priceMatch ? priceMatch[1] : "3.99";

  let cart = JSON.parse(localStorage.getItem("simpleScentsCart") || "[]");

  function saveCart() {
    localStorage.setItem("simpleScentsCart", JSON.stringify(cart));
  }

  function sameProduct(a, b) {
    return String(a.name || "").trim().toLowerCase() === String(b.name || "").trim().toLowerCase();
  }

  function addToCart() {
    const product = {
      name: title,
      price: price,
      size: "2ml sample",
      page: window.location.pathname,
      qty: 1
    };

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
    alert(title + " added to cart.");
  }

  function buyNow(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const product = {
      name: title,
      price: price,
      size: "2ml sample",
      page: window.location.pathname,
      qty: 1
    };

    localStorage.setItem("checkoutMode", "buyNow");
    localStorage.setItem("buyNowItem", JSON.stringify(product));
    window.location.href = "checkout.html";
  }

  if (document.querySelector(".ss-bottom-bar")) return;

  const style = document.createElement("style");
  style.innerHTML = `
    body { padding-bottom: 115px !important; }

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
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.className = "ss-bottom-bar";

  const addBtn = document.createElement("button");
  addBtn.className = "ss-add";
  addBtn.innerText = "Add to Cart";
  addBtn.onclick = addToCart;

  const buyBtn = document.createElement("button");
  buyBtn.className = "ss-buy";
  buyBtn.innerText = "Buy Now";
  buyBtn.addEventListener("click", buyNow);

  bar.appendChild(addBtn);
  bar.appendChild(buyBtn);
  document.body.appendChild(bar);
})();
