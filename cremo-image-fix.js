// Upload this as cremo-image-fix.js and add this before </body> on cremo-spice-black-vanilla.html:
// <script src="cremo-image-fix.js"></script>

(function () {
  const pageTitle = (document.title + " " + (document.querySelector("h1")?.innerText || "")).toLowerCase();
  if (!pageTitle.includes("cremo") || !pageTitle.includes("black vanilla")) return;

  if (!document.querySelector(".back-button")) {
    const back = document.createElement("a");
    back.className = "back-button";
    back.href = "index.html";
    back.setAttribute("aria-label", "Back to shop");
    back.innerHTML = "‹";
    document.body.insertBefore(back, document.body.firstChild);
  }

  const style = document.createElement("style");
  style.innerHTML = `
    body { padding-top: 28px !important; }
    .back-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 999px;
      background: #1f1f1f;
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      text-decoration: none;
      font-size: 30px;
      font-weight: 700;
      margin-bottom: 24px;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);

  const imgs = Array.from(document.querySelectorAll(".carousel img, .gallery img, img"));
  if (imgs[0]) imgs[0].src = "cremo-spice-black-vanilla-handheld.jpg";
  if (imgs[1]) imgs[1].src = "cremo-spice-black-vanilla-close.jpg";
})();
