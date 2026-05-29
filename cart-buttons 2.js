// Simple Scents sticky bottom buttons
(function () {
  const title =
    document.querySelector("h1")?.innerText?.trim() ||
    document.title ||
    "Simple Scents Sample";

  const priceText =
    document.querySelector(".price")?.innerText?.trim() ||
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

  function buyNow() {
    addToCart();
    window.location.href = "https://www.paypal.com/";
  }

  const style = document.createElement("style");
  style.innerHTML = `
    body { padding-bottom: 110px !important; }

    .ss-bottom-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.92);
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
  buyBtn.onclick = buyNow;

  bar.appendChild(addBtn);
  bar.appendChild(buyBtn);
  document.body.appendChild(bar);
})();
