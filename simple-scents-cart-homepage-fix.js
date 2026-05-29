// Simple Scents: remove extra swipe text + move cart quantity selector lower
// Upload this file to the same folder as index.html and cart.html.
// Add this line right before </body> in BOTH index.html and cart.html:
// <script src="simple-scents-cart-homepage-fix.js"></script>

(function () {
  function removeSwipeText() {
    const targets = Array.from(document.querySelectorAll('body *')).filter(el => {
      const text = (el.textContent || '').trim().toLowerCase();
      return text === 'swipe to see all images';
    });

    targets.forEach(el => el.remove());
  }

  function moveQuantityButtonDown() {
    // Finds the cart quantity box that has - and + buttons, then moves it lower.
    const possibleBoxes = Array.from(document.querySelectorAll('div, section, article'));

    possibleBoxes.forEach(box => {
      const buttons = Array.from(box.querySelectorAll('button'));
      const hasMinus = buttons.some(btn => (btn.textContent || '').trim() === '-');
      const hasPlus = buttons.some(btn => (btn.textContent || '').trim() === '+');

      if (hasMinus && hasPlus) {
        box.classList.add('ss-quantity-moved-down');
      }
    });
  }

  function addStyles() {
    if (document.getElementById('ss-cart-homepage-fix-style')) return;

    const style = document.createElement('style');
    style.id = 'ss-cart-homepage-fix-style';
    style.textContent = `
      /* Make the quantity selector sit lower inside the cart item square */
      .ss-quantity-moved-down {
        transform: translateY(42px) !important;
        margin-top: 18px !important;
      }

      /* Keeps it even and centered */
      .ss-quantity-moved-down {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      @media (max-width: 600px) {
        .ss-quantity-moved-down {
          transform: translateY(48px) !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function runFix() {
    addStyles();
    removeSwipeText();
    moveQuantityButtonDown();
  }

  runFix();
  setTimeout(runFix, 250);
  setTimeout(runFix, 900);
})();
