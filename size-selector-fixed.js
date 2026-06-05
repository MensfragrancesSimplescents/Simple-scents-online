/* Simple Scents — real 1 mL / 2 mL selector. Adds buttons under the swipe text and tells cart which size/price was chosen. */
(function () {

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

  function productName() {
    const titleEl = document.querySelector(".product-title") || document.querySelector("main h1") || document.querySelector("body > h1");
    return (titleEl && titleEl.textContent.trim()) || document.title.replace("| Simple Scents", "").trim() || "Fragrance Sample";
  }
  const name = productName();
  const prices = simpleScentsPricePair(name);
  function money(n) { return "$" + Number(n).toFixed(2); }
  function addCSS() {
    if (document.getElementById("ss-size-selector-css")) return;
    const style = document.createElement("style");
    style.id = "ss-size-selector-css";
    style.textContent = `
      .ss-size-box{width:min(94%,430px);margin:12px auto 18px;padding:14px;border:2px solid #111;border-radius:16px;background:#fff;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.12);box-sizing:border-box;clear:both;display:block!important;position:relative;z-index:9;color:#111;}
      .ss-size-title{font-size:16px;font-weight:900;margin-bottom:10px;color:#111;}
      .ss-size-buttons{display:flex;gap:10px;justify-content:center;align-items:stretch;}
      .ss-size-option{flex:1;min-height:58px;border:2px solid #111;border-radius:14px;background:#fff;color:#111;font-size:17px;font-weight:900;line-height:1.1;padding:10px 8px;}
      .ss-size-option small{display:block;margin-top:5px;font-size:13px;font-weight:800;}
      .ss-size-option.ss-active{background:#111;color:#fff;}
      .ss-size-note{margin-top:8px;font-size:12px;color:#555;font-weight:700;}
    `;
    document.head.appendChild(style);
  }
  function setChoice(size, price) {
    window.simpleScentsSelectedSample = { size: size, price: Number(price), name: name };
    localStorage.setItem("simpleScentsSelectedSize", size);
    localStorage.setItem("simpleScentsSelectedPrice", String(price));
    document.body.dataset.selectedSize = size;
    document.body.dataset.selectedPrice = String(price);
    const priceEl = document.querySelector(".price");
    if (priceEl) priceEl.textContent = money(price) + " · " + size + " sample";
  }
  window.simpleScentsGetSelectedSample = function () {
    const active = document.querySelector(".ss-size-option.ss-active");
    if (active) return { size: active.dataset.size, price: Number(active.dataset.price), name: name };
    return window.simpleScentsSelectedSample || { size: "2 mL", price: prices.two, name: name };
  };
  function findSwipeText() {
    return Array.from(document.querySelectorAll("p,div,span,small")).find(el => {
      const t = simpleScentsCleanName(el.textContent);
      return t.includes("swipe") && (t.includes("photo") || t.includes("image") || t.includes("left") || t.includes("right"));
    });
  }
  function install() {
    addCSS();
    if (document.querySelector(".ss-size-box")) return;
    const box = document.createElement("div");
    box.className = "ss-size-box";
    box.innerHTML = `
      <div class="ss-size-title">Choose sample size</div>
      <div class="ss-size-buttons">
        <button type="button" class="ss-size-option" data-size="1 mL" data-price="${prices.one}">1 mL<small>${money(prices.one)}</small></button>
        <button type="button" class="ss-size-option ss-active" data-size="2 mL" data-price="${prices.two}">2 mL<small>${money(prices.two)}</small></button>
      </div>
      <div class="ss-size-note">Pick a size before adding to cart.</div>
    `;
    const spot = findSwipeText();
    if (spot) spot.insertAdjacentElement("afterend", box);
    else (document.querySelector(".swipe") || document.querySelector("main") || document.body).insertAdjacentElement("afterend", box);
    box.querySelectorAll(".ss-size-option").forEach(btn => {
      btn.addEventListener("click", function () {
        box.querySelectorAll(".ss-size-option").forEach(b => b.classList.remove("ss-active"));
        btn.classList.add("ss-active");
        setChoice(btn.dataset.size, Number(btn.dataset.price));
      });
    });
    setChoice("2 mL", prices.two);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
})();
