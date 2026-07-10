const SERVICES = {
  google: {
    label: "Google",
    searchUrl: "https://www.google.com/search?q="
  },
  chatgpt: {
    label: "ChatGPT",
    searchUrl: "https://chatgpt.com/?q="
  },
  claude: {
    label: "Claude",
    searchUrl: "https://claude.ai/new?q="
  }
};

const state = {
  service: localStorage.getItem("safariStartService") || "google"
};

const elements = {
  salutation: document.querySelector("#salutation"),
  message: document.querySelector("#message"),
  switcher: document.querySelector("#serviceSwitcher"),
  lens: document.querySelector("#serviceLens"),
  services: document.querySelectorAll("[data-service]"),
  searchForm: document.querySelector("#searchForm"),
  searchInput: document.querySelector("#searchInput"),
  attachButton: document.querySelector("#attachButton"),
  fileInput: document.querySelector("#fileInput"),
  attachment: document.querySelector("#attachment")
};

renderGreeting();
selectService(state.service, false);
requestAnimationFrame(() => elements.searchInput.focus());

elements.services.forEach((button) => {
  button.addEventListener("click", () => selectService(button.dataset.service));
});

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = elements.searchInput.value.trim();
  if (!query) return;

  window.location.href = `${SERVICES[state.service].searchUrl}${encodeURIComponent(query)}`;
});

elements.attachButton.addEventListener("click", () => elements.fileInput.click());

elements.fileInput.addEventListener("change", () => {
  const [file] = elements.fileInput.files;
  if (!file) return;

  elements.attachment.hidden = false;
  elements.attachment.textContent = `Ausgewählt: ${file.name}`;
});

window.addEventListener("resize", moveLens);

function selectService(service, save = true) {
  if (!SERVICES[service]) return;
  state.service = service;

  if (save) localStorage.setItem("safariStartService", service);

  elements.services.forEach((button) => {
    const isActive = button.dataset.service === service;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.searchInput.placeholder = `Frag ${SERVICES[service].label} etwas`;
  moveLens();
}

function moveLens() {
  const activeButton = document.querySelector(".service.is-active");
  if (!activeButton) return;

  const x = activeButton.offsetLeft + (activeButton.offsetWidth - elements.lens.offsetWidth) / 2;
  elements.lens.style.setProperty("--lens-x", `${x}px`);
}

function renderGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const messages = [
    "Ein guter Gedanke darf klein anfangen.",
    "Heute ist ein guter Tag, etwas in Bewegung zu bringen.",
    "Nimm dir den Raum für eine klare Idee.",
    "Es reicht, mit dem Nächsten zu beginnen."
  ];

  elements.salutation.textContent = `${greeting}, Yannis.`;
  elements.message.textContent = messages[new Date().getDate() % messages.length];
}
