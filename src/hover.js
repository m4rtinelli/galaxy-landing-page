const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let interval = null;
const spans = document.querySelectorAll(".button-wrapper .button span");

spans.forEach((span) => {
  span.addEventListener("mouseover", (event) => {
    clearInterval(interval);
    let iteration = 0;

    interval = setInterval(() => {
      const target = event.target;
      const value = target.dataset.value;

      target.innerText = value
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return value[index];
          }

          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= value.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  });
});
