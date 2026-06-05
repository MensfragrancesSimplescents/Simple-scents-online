
// Simple Scents cart buttons + 1 mL / 2 mL sample selector
(function () {
  const path = window.location.pathname.toLowerCase();
  const file = path.split("/").pop();

  // Do NOT show Add to Cart / Buy Now on homepage or cart page
  if (file === "" || file === "index.html" || file === "cart.html" || file === "checkout.html" || path.endsWith("/")) {
    return;
  }

  const ONE_ML_PRICES = [
    ["le male le parfum", 4.49],
    ["le beau", 4.49],
    ["le male", 3.49],
    ["nautica", 2.49],
    ["profondo", 3.99],
    ["invictus", 3.49],
    ["9pm", 2.99],
    ["seductive", 2.49],
    ["instant crush", 4.99],
    ["ysl", 4.99],
    ["myself", 4.99],
    ["prada", 3.99],
    ["one million", 3.49],
    ["1 million", 3.49],
    ["cremo", 2.49],
    ["pacific", 4.99],
    ["ventana", 2.49],
    ["aromatic", 1.99],
    ["eros flame", 4.49]
  ];

  function money(n) {
    return "$" + Number(n || 0).toFixed(2);
  }

  function getProductName() {
    const titleEl =
      document.querySelector(".product-title") ||
      document.querySelector("main h1") ||
      Array.from(document.querySelectorAll("h1")).find(h => (h.innerText || "").trim().toLowerCase() !== "simple scents") ||
      document.querySelector("body > h1");

    let name = titleEl?.innerText?.trim().replace(/\s+/g, " ");

    if (!name || name.toLowerCase() === "simple scents") {
      name = (document.title || "")
        .replace("| Simple Scents", "")
        .replace("- Simple Scents", "")
        .trim();
    }

    return name || "Fragrance Sample";
  }

  function getTwoMlPrice() {
    const priceText =
      document.querySelector(".price")?.innerText?.trim() ||
      document.querySelector('[class*="price"]')?.innerText?.trim() ||
      "$3.99";
    const priceMatch = priceText.match(/\$([0-9]+(?:\.[0-9]{2})?)/);
    return priceMatch ? parseFloat(priceMatch[1]) : 3.99;
  }

  function getOneMlPrice(name, twoMlPrice) {
    const key = String(name || "").toLowerCase();
    const found = ONE_ML_PRICES.find(row => key.includes(row[0]));
    if (found) return found[1];

    // Safe fallback: about 65% of 2 mL price, rounded to a clean .49/.99 style price.
    const raw = Math.max(1.99, twoMlPrice * 0.65);
    return Math.round(raw * 2) / 2 - 0.01;
  }

  const title = getProductName();
  const twoMlPrice = getTwoMlPrice();
  const oneMlPrice = getOneMlPrice(title, twoMlPrice);
  let selectedSize = localStorage.getItem("simpleScentsSelectedSize") || "2ml";

  function currentPrice() {
    return selectedSize === "1ml" ? oneMlPrice : twoMlPrice;
  }

  function currentSizeText() {
    return selectedSize === "1ml" ? "1ml sample" : "2ml sample";
  }

  function updatePriceText() {
    const priceEl = document.querySelector(".price") || document.querySelector('[class*="price"]');
    if (priceEl) {
      priceEl.textContent = money(currentPrice()) + " · " + currentSizeText();
    }
  }

  function updateSelectorButtons() {
    document.querySelectorAll(".ss-size-btn").forEach(btn => {
      const active = btn.dataset.size === selectedSize;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    updatePriceText();
  }

  function addSelector() {
    if (document.querySelector(".ss-size-selector")) return;

    const selector = document.createElement("div");
    selector.className = "ss-size-selector";
    selector.innerHTML = `
      <div class="ss-size-title">Choose sample size</div>
      <div class="ss-size-buttons">
        <button type="button" class="ss-size-btn" data-size="1ml">1 mL · ${money(oneMlPrice)}</button>
        <button type="button" class="ss-size-btn" data-size="2ml">2 mL · ${money(twoMlPrice)}</button>
      </div>
      <p class="ss-size-note">Pick a size before buying or adding to cart.</p>
    `;

    const hint =
      document.querySelector(".hint") ||
      document.querySelector(".swipe-hint") ||
      Array.from(document.querySelectorAll("p")).find(p => (p.innerText || "").toLowerCase().includes("swipe"));

    if (hint && hint.parentNode) {
      hint.insertAdjacentElement("afterend", selector);
    } else {
      const swipe = document.querySelector(".swipe") || document.querySelector('[style*="overflow-x"]');
      if (swipe && swipe.parentNode) {
        swipe.insertAdjacentElement("afterend", selector);
      } else {
        document.body.insertBefore(selector, document.querySelector(".info") || null);
      }
    }

    selector.addEventListener("click", function (e) {
      const btn = e.target.closest(".ss-size-btn");
      if (!btn) return;
      selectedSize = btn.dataset.size;
      localStorage.setItem("simpleScentsSelectedSize", selectedSize);
      updateSelectorButtons();
    });

    updateSelectorButtons();
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem("simpleScentsCart") || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("simpleScentsCart", JSON.stringify(cart));
  }

  function sameProduct(a, b) {
    return String(a.name || "").trim().toLowerCase() === String(b.name || "").trim().toLowerCase()
      && String(a.size || "").trim().toLowerCase() === String(b.size || "").trim().toLowerCase();
  }

  function productObject() {
    return {
      name: title,
      price: currentPrice().toFixed(2),
      size: currentSizeText(),
      page: window.location.pathname,
      qty: 1
    };
  }

  function addToCart() {
    const product = productObject();
    const cart = loadCart();
    const existingItem = cart.find(item => sameProduct(item, product));

    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
      existingItem.price = product.price;
      existingItem.size = product.size;
      existingItem.page = product.page;
    } else {
      cart.push(product);
    }

    saveCart(cart);
    alert(title + " " + product.size + " added to cart.");
  }

  function buyNow(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const product = productObject();
    localStorage.setItem("checkoutMode", "buyNow");
    localStorage.setItem("buyNowItem", JSON.stringify(product));
    window.location.href = "checkout.html";
  }

  if (!document.querySelector("#ss-size-selector-style")) {
    const style = document.createElement("style");
    style.id = "ss-size-selector-style";
    style.innerHTML = `
      .ss-size-selector {
        background: #000;
        border: 1px solid #333;
        border-radius: 22px;
        padding: 16px;
        margin: 12px 0 18px;
        color: #fff;
        text-align: center;
      }
      .ss-size-title {
        font-size: 18px;
        font-weight: 900;
        margin-bottom: 12px;
      }
      .ss-size-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .ss-size-btn {
        background: #fff;
        color: #000;
        border: 2px solid #fff;
        border-radius: 999px;
        padding: 14px 8px;
        font-size: 16px;
        font-weight: 900;
        cursor: pointer;
      }
      .ss-size-btn.active {
        outline: 3px solid #777;
        box-shadow: 0 0 0 2px #000 inset;
      }
      .ss-size-note {
        color: #ddd;
        font-size: 15px;
        margin: 12px 0 0;
        line-height: 1.35;
      }
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
  }

  addSelector();

  if (document.querySelector(".ss-bottom-bar")) return;

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
