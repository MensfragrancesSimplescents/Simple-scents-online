// Cremo image fix: first photo = handheld Cremo, second photo = normal Cremo
(function () {
  const pageText = document.body.innerText.toLowerCase();
  const isCremoPage =
    pageText.includes("cremo spice") ||
    window.location.pathname.toLowerCase().includes("cremo");

  if (!isCremoPage) return;

  const imageNames = [
    "cremo-spice-black-vanilla-handheld.jpg",
    "cremo-spice-black-vanilla-normal.jpg"
  ];

  const imgs = document.querySelectorAll(".slide img, .swipe img, img");

  if (imgs.length >= 2) {
    imgs[0].src = imageNames[0];
    imgs[0].alt = "Cremo Spice & Black Vanilla handheld photo";

    imgs[1].src = imageNames[1];
    imgs[1].alt = "Cremo Spice & Black Vanilla normal photo";
  }
})();
