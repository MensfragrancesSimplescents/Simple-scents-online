/* Simple Scents FIXED — adds a big 1 mL / 2 mL selector under the photo swipe text on product pages. */
(function () {
  const PRICES = {
    "jpg le male edt": [3.49, 5.99],
    "jpg le male le parfum": [4.49, 7.99],
    "jpg le beau edt": [4.49, 7.99],
    "nautica voyage": [2.49, 3.99],
    "acqua di gio profondo edp": [3.99, 6.99],
    "invictus edt": [3.49, 5.99],
    "afnan 9pm": [2.99, 4.99],
    "9pm": [2.99, 4.99],
    "guess seductive homme": [2.49, 3.99],
    "mancera instant crush": [4.99, 7.99],
    "ysl myslf edp": [4.99, 7.99],
    "prada luna rossa ocean": [3.99, 6.99],
    "1 million edt": [3.49, 5.99],
    "paco rabanne 1 million edt": [3.49, 5.99],
    "cremo spice & black vanilla": [2.49, 3.99],
    "cremo spice and black vanilla": [2.49, 3.99],
    "pacific rock moss": [4.99, 7.99],
    "goldfield & banks pacific rock moss": [4.99, 7.99],
    "armaf ventana pour homme": [2.49, 3.99],
    "aromatic citrus pour homme": [1.99, 3.49],
    "versace eros flame": [4.49, 7.49]
  };

  const clean = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9& ]/g, " ").replace(/\s+/g, " ").trim();
  const money = (n) => `$${Number(n).toFixed(2)}`;

  function addCSS() {
    if (document.getElementById("ss-size-selector-css")) return;
    const style = document.createElement("style");
    style.id = "ss-size-selector-css";
    style.textContent = `
      .ss-size-box{width:min(94%,430px);margin:12px auto 18px;padding:14px;border:2px solid #111;border-radius:16px;background:#fff;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.12);box-sizing:border-box;clear:both;display:block!important;position:relative;z-index:9;}
      .ss-size-title{font-size:16px;font-weight:800;margin-bottom:10px;color:#111;}
      .ss-size-buttons{display:flex;gap:10px;justify-content:center;align-items:stretch;}
      .ss-size-option{flex:1;min-height:58px;border:2px solid #111;border-radius:14px;background:#fff;color:#111;font-size:17px;font-weight:800;line-height:1.1;padding:10px 8px;}
      .ss-size-option small{display:block;margin-top:5px;font-size:13px;font-weight:700;}
      .ss-size-option.ss-active{background:#111;color:#fff;}
      .ss-size-note{margin-top:8px;font-size:12px;color:#555;}
    `;
    document.head.appendChild(style);
  }

  function productName() {
    const title = document.querySelector("h1,.product-title,.fragrance-title,[data-product-name]");
    return clean((title && (title.dataset.productName || title.textContent)) || document.title || location.pathname);
  }

  function pricesFor(name) {
    const exact = PRICES[name];
    if (exact) return exact;
    const key = Object.keys(PRICES).find(k => name.includes(k) || k.includes(name));
    return key ? PRICES[key] : [3.49, 5.99];
  }

  function findSpot() {
    const all = Array.from(document.querySelectorAll("body *"));
    const swipe = all.find(el => {
      const t = clean(el.textContent);
      return t.includes("swipe") && (t.includes("photo") || t.includes("image") || t.includes("left") || t.includes("right"));
    });
    if (swipe) return swipe;

    return document.querySelector(".swipe-text,.carousel-text,.image-note,.product-images,.carousel,.slider,.gallery") || document.querySelector("img");
  }

  function setChoice(size, price) {
    localStorage.setItem("simpleScentsSelectedSize", size);
    localStorage.setItem("simpleScentsSelectedPrice", String(price));
    document.body.dataset.selectedSize = size;
    document.body.dataset.selectedPrice = String(price);

    Array.from(document.querySelectorAll(".price,.product-price,[data-price],[id*='price']")).forEach(el => {
      if (/\$\d/.test(el.textContent || "") || el.dataset.price !== undefined) {
        el.textContent = money(price);
        el.dataset.price = String(price);
      }
    });
  }

  function install() {
    addCSS();
    if (document.querySelector(".ss-size-box")) return;

    const [oneML, twoML] = pricesFor(productName());
    const box = document.createElement("div");
    box.className = "ss-size-box";
    box.innerHTML = `
      <div class="ss-size-title">Choose sample size</div>
      <div class="ss-size-buttons">
        <button type="button" class="ss-size-option" data-size="1 mL" data-price="${oneML}">1 mL<small>${money(oneML)}</small></button>
        <button type="button" class="ss-size-option ss-active" data-size="2 mL" data-price="${twoML}">2 mL<small>${money(twoML)}</small></button>
      </div>
      <div class="ss-size-note">Pick 1 mL or 2 mL before adding to cart.</div>
    `;

    const spot = findSpot();
    if (spot && spot.parentNode) spot.insertAdjacentElement("afterend", box);
    else document.body.prepend(box);

    box.querySelectorAll(".ss-size-option").forEach(btn => {
      btn.addEventListener("click", () => {
        box.querySelectorAll(".ss-size-option").forEach(b => b.classList.remove("ss-active"));
        btn.classList.add("ss-active");
        setChoice(btn.dataset.size, Number(btn.dataset.price));
      });
    });
    setChoice("2 mL", twoML);
  }

  document.addEventListener("click", function (e) {
    const active = document.querySelector(".ss-size-option.ss-active");
    const btn = e.target.closest("button,a");
    if (!active || !btn) return;
    const text = clean(btn.textContent);
    if (text.includes("add to cart") || text.includes("buy now")) {
      setChoice(active.dataset.size, Number(active.dataset.price));
    }
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install);
  else install();
  new MutationObserver(install).observe(document.documentElement, { childList: true, subtree: true });
})();
