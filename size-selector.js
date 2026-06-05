/* Simple Scents — adds 1 mL / 2 mL choice under the photo swipe text on fragrance pages. */
(function () {
  const PRICES = {
    "jpg le male edt": { "1ml": 3.49, "2ml": 5.99 },
    "jpg le male le parfum": { "1ml": 4.49, "2ml": 7.99 },
    "jpg le beau edt": { "1ml": 4.49, "2ml": 7.99 },
    "nautica voyage": { "1ml": 2.49, "2ml": 3.99 },
    "acqua di gio profondo edp": { "1ml": 3.99, "2ml": 6.99 },
    "invictus edt": { "1ml": 3.49, "2ml": 5.99 },
    "afnan 9pm": { "1ml": 2.99, "2ml": 4.99 },
    "9pm": { "1ml": 2.99, "2ml": 4.99 },
    "guess seductive homme": { "1ml": 2.49, "2ml": 3.99 },
    "mancera instant crush": { "1ml": 4.99, "2ml": 7.99 },
    "ysl myslf edp": { "1ml": 4.99, "2ml": 7.99 },
    "prada luna rossa ocean": { "1ml": 3.99, "2ml": 6.99 },
    "1 million edt": { "1ml": 3.49, "2ml": 5.99 },
    "paco rabanne 1 million edt": { "1ml": 3.49, "2ml": 5.99 },
    "cremo spice & black vanilla": { "1ml": 2.49, "2ml": 3.99 },
    "cremo spice and black vanilla": { "1ml": 2.49, "2ml": 3.99 },
    "pacific rock moss": { "1ml": 4.99, "2ml": 7.99 },
    "goldfield & banks pacific rock moss": { "1ml": 4.99, "2ml": 7.99 },
    "armaf ventana pour homme": { "1ml": 2.49, "2ml": 3.99 },
    "aromatic citrus pour homme": { "1ml": 1.99, "2ml": 3.49 },
    "versace eros flame": { "1ml": 4.49, "2ml": 7.49 }
  };

  const money = n => `$${Number(n).toFixed(2)}`;
  const clean = s => String(s || "").toLowerCase().replace(/[^a-z0-9& ]/g, " ").replace(/\s+/g, " ").trim();

  function getProductName() {
    const picks = [
      document.querySelector("h1"),
      document.querySelector(".product-title"),
      document.querySelector(".fragrance-title"),
      document.querySelector("[data-product-name]")
    ].filter(Boolean);
    return clean((picks[0] && (picks[0].dataset.productName || picks[0].textContent)) || document.title);
  }

  function findPrices(name) {
    if (PRICES[name]) return PRICES[name];
    const key = Object.keys(PRICES).find(k => name.includes(k) || k.includes(name));
    return key ? PRICES[key] : { "1ml": 3.49, "2ml": 5.99 };
  }

  function findSwipeText() {
    const all = Array.from(document.querySelectorAll("body *"));
    return all.find(el => /swipe.*(left|right|see).*photo|swipe.*image/i.test(el.textContent || ""));
  }

  function updateVisiblePrice(price) {
    const priceEls = Array.from(document.querySelectorAll(".price, .product-price, [data-price], [id*='price']"));
    priceEls.forEach(el => {
      if (/\$\d/.test(el.textContent || "") || el.dataset.price !== undefined) {
        el.textContent = money(price);
        el.dataset.price = String(price);
      }
    });
  }

  function saveChoice(size, price) {
    localStorage.setItem("simpleScentsSelectedSize", size);
    localStorage.setItem("simpleScentsSelectedPrice", String(price));
    document.body.dataset.selectedSize = size;
    document.body.dataset.selectedPrice = String(price);
  }

  function addSelector() {
    if (document.querySelector(".sample-size-box")) return;
    const productName = getProductName();
    const prices = findPrices(productName);
    const box = document.createElement("div");
    box.className = "sample-size-box";
    box.innerHTML = `
      <div class="sample-size-title">Choose sample size</div>
      <div class="sample-size-buttons">
        <button type="button" class="sample-size-option" data-size="1ml" data-price="${prices["1ml"]}">1 mL<small>${money(prices["1ml"])}</small></button>
        <button type="button" class="sample-size-option active" data-size="2ml" data-price="${prices["2ml"]}">2 mL<small>${money(prices["2ml"])}</small></button>
      </div>
      <div class="sample-size-note">2 mL gives customers a better deal.</div>
    `;

    const swipe = findSwipeText();
    if (swipe && swipe.parentNode) swipe.insertAdjacentElement("afterend", box);
    else {
      const imgArea = document.querySelector(".carousel, .slider, .product-images, img");
      (imgArea || document.body.firstElementChild || document.body).insertAdjacentElement("afterend", box);
    }

    box.querySelectorAll(".sample-size-option").forEach(btn => {
      btn.addEventListener("click", () => {
        box.querySelectorAll(".sample-size-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const size = btn.dataset.size;
        const price = Number(btn.dataset.price);
        saveChoice(size, price);
        updateVisiblePrice(price);
      });
    });

    saveChoice("2ml", prices["2ml"]);
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest("button, a");
    if (!btn) return;
    const text = clean(btn.textContent);
    if (!/add to cart|buy now/.test(text)) return;
    const active = document.querySelector(".sample-size-option.active");
    if (!active) return;
    saveChoice(active.dataset.size, Number(active.dataset.price));
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addSelector);
  else addSelector();
})();
