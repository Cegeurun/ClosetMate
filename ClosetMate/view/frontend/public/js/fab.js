// Smart draggable FAB with arc menu + auto-close
document.addEventListener("DOMContentLoaded", () => {
  const fabContainer = document.querySelector(".fab-container");
  // const fabMain = document.querySelector(".fab-main");
  const items = document.querySelectorAll(".fab-item");

  let isDragging = false;
  let offsetX, offsetY;

  // Drag start
  // fabMain.addEventListener("mousedown", (e) => {
  //   isDragging = true;
  //   offsetX = e.clientX - fabContainer.getBoundingClientRect().left;
  //   offsetY = e.clientY - fabContainer.getBoundingClientRect().top;
  //   fabContainer.style.transition = "none";
  // });

  // Dragging
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    fabContainer.style.left = `${e.clientX - offsetX}px`;
    fabContainer.style.top = `${e.clientY - offsetY}px`;
    fabContainer.style.right = "auto";
    fabContainer.style.bottom = "auto";
    fabContainer.style.position = "fixed";
  });

  // Drag end
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      fabContainer.style.transition = "all 0.3s ease";
    }
  });

  // Toggle menu
  // fabMain.addEventListener("click", () => {
  //   if (isDragging) return;
  //   fabContainer.classList.toggle("open");

  //   if (fabContainer.classList.contains("open")) {
  //     openArcMenu();
  //   } else {
  //     closeArcMenu();
  //   }
  // });

  // Auto-close when clicking a menu item
  items.forEach((item) => {
    item.addEventListener("click", () => {
      closeArcMenu();
      fabContainer.classList.remove("open");
    });
  });

  // Auto-close when clicking outside
  document.addEventListener("click", (e) => {
    if (
      fabContainer.classList.contains("open") &&
      !fabContainer.contains(e.target)
    ) {
      closeArcMenu();
      fabContainer.classList.remove("open");
    }
  });

  function openArcMenu() {
    // Find nearest corner
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = fabContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const distTL = Math.hypot(cx, cy);
    const distTR = Math.hypot(vw - cx, cy);
    const distBL = Math.hypot(cx, vh - cy);
    const distBR = Math.hypot(vw - cx, vh - cy);

    const min = Math.min(distTL, distTR, distBL, distBR);
    let corner = "br";
    if (min === distTL) corner = "tl";
    else if (min === distTR) corner = "tr";
    else if (min === distBL) corner = "bl";

    // Spread items in arc
    const spread = Math.PI / 2; // 90°
    const radius = 120;
    const step = spread / (items.length - 1);

    items.forEach((item, i) => {
      let angle;
      switch (corner) {
        case "br": angle = Math.PI + i * step; break;       // left-up
        case "bl": angle = (3 / 2) * Math.PI + i * step; break; // right-up
        case "tr": angle = Math.PI / 2 + i * step; break;     // left-down
        case "tl": angle = 0 + i * step; break;             // right-down
      }
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      item.style.transform = `translate(${x}px, ${y}px)`;
      item.style.transitionDelay = `${i * 0.05}s`; // staggered
    });
  }

  function closeArcMenu() {
    items.forEach((item) => {
      item.style.transform = "translate(0,0)";
      item.style.transitionDelay = "0s";
    });
  }
});
