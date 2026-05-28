// Strong iPhone/Safari phone number auto-link fix
(function () {
  var meta = document.querySelector('meta[name="format-detection"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "format-detection";
    meta.content = "telephone=no";
    document.head.appendChild(meta);
  }

  var style = document.createElement("style");
  style.textContent = `
    a[href^="tel"],
    a[x-apple-data-detectors],
    [x-apple-data-detectors],
    .apple-data-detectors,
    .apple-data-detectors a {
      color: #d1d1d1 !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      pointer-events: none !important;
      cursor: default !important;
    }
  `;
  document.head.appendChild(style);
})();
