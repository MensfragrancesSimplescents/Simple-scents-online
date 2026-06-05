
function simpleScentsCleanName(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9& ]/g, " ").replace(/\s+/g, " ").trim();
}
const SIMPLE_SCENTS_SIZE_PRICES = {
  "acqua di gio profondo": { one: 3.99, two: 6.49 },
  "afnan 9pm": { one: 2.99, two: 4.99 },
  "9pm": { one: 2.99, two: 4.99 },
  "armaf ventana": { one: 2.49, two: 3.99 },
  "aromatic citrus": { one: 1.99, two: 3.99 },
  "cremo spice black vanilla": { one: 2.49, two: 3.99 },
  "cremo spice & black vanilla": { one: 2.49, two: 3.99 },
  "guess seductive homme": { one: 2.49, two: 3.99 },
  "invictus": { one: 3.49, two: 5.99 },
  "jpg le beau": { one: 4.49, two: 7.99 },
  "jpg le male le parfum": { one: 4.49, two: 7.99 },
  "jpg le male": { one: 3.49, two: 5.99 },
  "mancera instant crush": { one: 4.99, two: 7.99 },
  "nautica voyage": { one: 2.49, two: 3.99 },
  "1 million": { one: 3.49, two: 5.99 },
  "one million": { one: 3.49, two: 5.99 },
  "pacific rock moss": { one: 4.99, two: 7.99 },
  "prada luna rossa ocean": { one: 3.99, two: 6.99 },
  "prada ocean": { one: 3.99, two: 6.99 },
  "ysl myslf": { one: 4.99, two: 7.99 },
  "ysl myself": { one: 4.99, two: 7.99 },
  "versace eros flame": { one: 4.49, two: 7.49 }
};
function simpleScentsPricePair(name) {
  const clean = simpleScentsCleanName(name);
  let keys = Object.keys(SIMPLE_SCENTS_SIZE_PRICES).sort((a,b)=>b.length-a.length);
  let key = keys.find(k => clean.includes(k) || k.includes(clean));
  return key ? SIMPLE_SCENTS_SIZE_PRICES[key] : { one: 3.49, two: 5.99 };
}
function simpleScentsSizeKey(size) {
  return String(size || "2 mL").toLowerCase().includes("1") ? "one" : "two";
}
function simpleScentsCorrectPrice(item) {
  const pair = simpleScentsPricePair(item.name || item.title || document.title || "");
  const key = simpleScentsSizeKey(item.size || item.sampleSize || "2 mL");
  const mapped = pair[key];
  if (mapped) return mapped;
  return parseFloat(String(item.price || "0").replace(/[^0-9.]/g, "")) || 0;
}
function simpleScentsCorrectPriceText(item) {
  return "$" + simpleScentsCorrectPrice(item).toFixed(2);
}

// Simple Scents cart buttons — supports 1 mL / 2 mL size choices.
(function () {
  const path = window.location.pathname.toLowerCase();
  const file = path.split("/").pop();
  if (file === "" || file === "index.html" || file === "cart.html" || file === "checkout.html" || path.endsWith("/")) return;
  function getProductName() {
    const titleEl = document.querySelector(".product-title") || document.querySelector("main h1") || document.querySelector("body > h1");
    let name = titleEl && titleEl.innerText ? titleEl.innerText.trim().replace(/\s+/g, " ") : "";
    if (!name || name.toLowerCase() === "simple scents") name = (document.title || "").replace("| Simple Scents", "").replace("- Simple Scents", "").trim();
    return name || "Fragrance Sample";
  }
  const title = getProductName();
  let cart = JSON.parse(localStorage.getItem("simpleScentsCart") || "[]");
  function saveCart() { localStorage.setItem("simpleScentsCart", JSON.stringify(cart)); }
  function getChoice() {
    if (typeof window.simpleScentsGetSelectedSample === "function") return window.simpleScentsGetSelectedSample();
    const pair = simpleScentsPricePair(title);
    return { size: "2 mL", price: pair.two, name: title };
  }
  function sameProduct(a, b) {
    return String(a.name || "").trim().toLowerCase() === String(b.name || "").trim().toLowerCase() && String(a.size || "2 mL").trim().toLowerCase() === String(b.size || "2 mL").trim().toLowerCase();
  }
  function makeProduct() {
    const choice = getChoice();
    return { name: title, price: Number(choice.price).toFixed(2), size: choice.size, page: window.location.pathname, qty: 1 };
  }
  function addToCart() {
    const product = makeProduct();
    const existingItem = cart.find(item => sameProduct(item, product));
    if (existingItem) { existingItem.qty = (existingItem.qty || 1) + 1; existingItem.price = product.price; existingItem.page = product.page; }
    else cart.push(product);
    saveCart();
    alert(title + " (" + product.size + ") added to cart.");
  }
  function buyNow(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const product = makeProduct();
    localStorage.setItem("checkoutMode", "buyNow");
    localStorage.setItem("buyNowItem", JSON.stringify(product));
    window.location.href = "checkout.html";
  }
  if (document.querySelector(".ss-bottom-bar")) return;
  const style = document.createElement("style");
  style.innerHTML = `
    body { padding-bottom: 115px !important; }
    .ss-bottom-bar{position:fixed;left:0;right:0;bottom:0;z-index:999999;background:rgba(0,0,0,.94);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.15);padding:12px 14px 22px;display:grid;grid-template-columns:1fr 1fr;gap:10px;box-sizing:border-box;}
    .ss-bottom-bar button{border:none;border-radius:999px;padding:16px 12px;font-size:16px;font-weight:800;cursor:pointer;}
    .ss-add{background:#222;color:white;border:1px solid rgba(255,255,255,.25)!important;}
    .ss-buy{background:white;color:black;}
  `;
  document.head.appendChild(style);
  const bar = document.createElement("div"); bar.className = "ss-bottom-bar";
  const addBtn = document.createElement("button"); addBtn.className = "ss-add"; addBtn.innerText = "Add to Cart"; addBtn.onclick = addToCart;
  const buyBtn = document.createElement("button"); buyBtn.className = "ss-buy"; buyBtn.innerText = "Buy Now"; buyBtn.addEventListener("click", buyNow);
  bar.appendChild(addBtn); bar.appendChild(buyBtn); document.body.appendChild(bar);
})();
