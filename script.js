/* ════════════════════════════════════════════════════════════
   ⚙️ CONFIGURATION — LES 2 SEULES CHOSES À MODIFIER
   ════════════════════════════════════════════════════════════ */

// 1️⃣ Ton endpoint Formspree (voir README, étape "Notifications")
//    Exemple : "https://formspree.io/f/abcdwxyz"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjgdojrk";

// 2️⃣ La date de votre rencontre (année, mois - 1, jour, heure, minute)
//    ⚠️ Les mois commencent à 0 en JS : 0 = janvier, 11 = décembre.
//    Exemple ci-dessous : 14 février 2024 à 20h30.
const DATE_RENCONTRE = new Date(2021, 6, 27, 20, 30);

/* ════════════════════════════════════════════════════════════
   Liste des activités du formulaire (modifiable librement)
   ════════════════════════════════════════════════════════════ */
const ACTIVITES = [
  { emoji: "🌊", libelle: "Balade près de la Seine" },
  { emoji: "🌇", libelle: "Sunset à Montmartre" },
  { emoji: "🍸", libelle: "On boit?" },
  { emoji: "🛵", libelle: "Balade en Cooltra" },
  { emoji: "🧺", libelle: "Pique-nique romantique" },
  { emoji: "🎬", libelle: "Cinéma" },
  { emoji: "🍝", libelle: "Restaurant" },
  { emoji: "🔐", libelle: "Silence Time" },
  { emoji: "🎱", libelle: "Billard?" },
  { emoji: "🖼️", libelle: "Musée" },
  { emoji: "🔞", libelle: "Hot-time" },
  { emoji: "🎲", libelle: "Soirée jeux de société" },
];

/* ════════════════════════════════════════════════════════════
   Raccourcis DOM
   ════════════════════════════════════════════════════════════ */
const $ = (sel) => document.querySelector(sel);

const ecranQuestion   = $("#ecran-question");
const ecranFormulaire = $("#ecran-formulaire");
const ecranMerci      = $("#ecran-merci");
const btnOui          = $("#btn-oui");
const btnNon          = $("#btn-non");
const formDate        = $("#form-date");
const grilleActivites = $("#grille-activites");
const statutEnvoi     = $("#statut-envoi");

/* ════════════════════════════════════════════════════════════
   1. Fond animé : cœurs flottants subtils
   ════════════════════════════════════════════════════════════ */
(function creerFondCoeurs() {
  const conteneur = $("#fond-coeurs");
  const symboles = ["❤️", "💗", "💕", "🤍"];
  const nombre = window.innerWidth < 560 ? 12 : 20;

  for (let i = 0; i < nombre; i++) {
    const coeur = document.createElement("span");
    coeur.className = "coeur-fond";
    coeur.textContent = symboles[i % symboles.length];
    coeur.style.left = Math.random() * 100 + "vw";
    coeur.style.setProperty("--taille", 12 + Math.random() * 20 + "px");
    coeur.style.setProperty("--duree", 11 + Math.random() * 14 + "s");
    coeur.style.setProperty("--delai", -Math.random() * 20 + "s");
    coeur.style.setProperty("--opacite", (0.08 + Math.random() * 0.14).toFixed(2));
    conteneur.appendChild(coeur);
  }
})();

/* ════════════════════════════════════════════════════════════
   2. Le bouton "Non" fuyard 😈
   - Au survol souris OU au toucher (mobile), il s'enfuit
     vers une position aléatoire, toujours dans l'écran.
   - Messages de plus en plus désespérés à chaque tentative.
   ════════════════════════════════════════════════════════════ */
const MESSAGES_NON = [
  "Non 😈",
  "Tu es sûre ? 🤨",
  "Vraiment ?? 🥺",
  "Réfléchis bien… 😏",
  "Impossible 😌",
  "Essaie encore 😜",
  "Jamais ! 💨",
  "vsy cliques sur OUI là 👀",
];
let tentativesNon = 0;

function faireFuirBoutonNon() {
  // Passe le bouton en position fixe au premier survol
  if (!btnNon.classList.contains("fuyard")) {
    const rect = btnNon.getBoundingClientRect();
    btnNon.classList.add("fuyard");
    btnNon.style.left = rect.left + "px";
    btnNon.style.top = rect.top + "px";
    void btnNon.offsetWidth;
  }

  // Le texte change AVANT la mesure (sinon le bouton s'élargit et déborde)
  tentativesNon++;
  btnNon.textContent = MESSAGES_NON[Math.min(tentativesNon, MESSAGES_NON.length - 1)];

  // ── Périmètre de fuite : la carte + une marge autour ──
  const PERIMETRE = 120; // px autour de la carte — ajuste à ton goût
  const carte = document.querySelector(".carte-question").getBoundingClientRect();
  const marge = 16;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  // Zone autorisée = carte élargie, mais jamais hors écran
  const minX = Math.max(marge, carte.left - PERIMETRE);
  const minY = Math.max(marge, carte.top - PERIMETRE);
  const maxX = Math.min(vw - btnNon.offsetWidth - marge,  carte.right + PERIMETRE - btnNon.offsetWidth);
  const maxY = Math.min(vh - btnNon.offsetHeight - marge, carte.bottom + PERIMETRE - btnNon.offsetHeight);

  // Nouvelle position aléatoire dans la zone, éloignée d'au moins 100px
  const actuelX = parseFloat(btnNon.style.left) || 0;
  const actuelY = parseFloat(btnNon.style.top) || 0;
  let x, y, essais = 0;
  do {
    x = minX + Math.random() * Math.max(1, maxX - minX);
    y = minY + Math.random() * Math.max(1, maxY - minY);
    essais++;
  } while (Math.hypot(x - actuelX, y - actuelY) < 100 && essais < 20);

  // Clamp final : toujours dans la zone ET dans l'écran
  btnNon.style.left = Math.min(Math.max(x, minX), maxX) + "px";
  btnNon.style.top  = Math.min(Math.max(y, minY), maxY) + "px";

  // Petite secousse rigolote
  btnNon.classList.remove("secousse");
  void btnNon.offsetWidth;
  btnNon.classList.add("secousse");
}

// Souris : fuit dès qu'on approche
btnNon.addEventListener("mouseenter", faireFuirBoutonNon);
// Mobile : fuit dès le contact, avant que le "click" ne se déclenche
btnNon.addEventListener("touchstart", (e) => {
  e.preventDefault();
  faireFuirBoutonNon();
}, { passive: false });
// Filet de sécurité : même si un clic passe, il ne fait que fuir
btnNon.addEventListener("click", (e) => {
  e.preventDefault();
  faireFuirBoutonNon();
});
// Clavier : on reste joueur mais accessible — Entrée le fait fuir aussi
btnNon.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    faireFuirBoutonNon();
  }
});

// Si la fenêtre est redimensionnée, on ramène le bouton dans l'écran
window.addEventListener("resize", () => {
  if (!btnNon.classList.contains("fuyard")) return;
  const marge = 16;
  const x = Math.min(parseFloat(btnNon.style.left) || 0, window.innerWidth - btnNon.offsetWidth - marge);
  const y = Math.min(parseFloat(btnNon.style.top) || 0, window.innerHeight - btnNon.offsetHeight - marge);
  btnNon.style.left = Math.max(marge, x) + "px";
  btnNon.style.top = Math.max(marge, y) + "px";
});

/* ════════════════════════════════════════════════════════════
   3. Clic sur "Oui" → célébration + formulaire
   ════════════════════════════════════════════════════════════ */
btnOui.addEventListener("click", () => {
  // Le bouton Non disparaît avec élégance
  btnNon.style.transition = "opacity 0.4s, transform 0.4s";
  btnNon.style.opacity = "0";
  btnNon.style.transform = "scale(0.5)";
  setTimeout(() => btnNon.remove(), 450);

  lancerPluieDeCoeurs();
  lancerConfettis();

  // Bascule d'écran après un court instant de magie
  setTimeout(() => {
    ecranQuestion.classList.remove("visible");
    ecranFormulaire.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1400);
});

/** Pluie de cœurs sur tout l'écran */
function lancerPluieDeCoeurs(nombre = 50) {
  const symboles = ["❤️", "💖", "💗", "💕", "💘", "🌹"];
  for (let i = 0; i < nombre; i++) {
    setTimeout(() => {
      const coeur = document.createElement("span");
      coeur.className = "coeur-pluie";
      coeur.textContent = symboles[Math.floor(Math.random() * symboles.length)];
      coeur.style.left = Math.random() * 100 + "vw";
      coeur.style.setProperty("--taille", 18 + Math.random() * 26 + "px");
      coeur.style.setProperty("--duree", 2.4 + Math.random() * 2 + "s");
      coeur.style.setProperty("--rotation", (Math.random() * 360 - 180) + "deg");
      document.body.appendChild(coeur);
      setTimeout(() => coeur.remove(), 5000);
    }, i * 60);
  }
}

/** Confettis depuis le centre de l'écran */
function lancerConfettis(nombre = 60) {
  const couleurs = ["#e0407a", "#ff6b9d", "#ecc88a", "#f4b8c9", "#ffffff"];
  for (let i = 0; i < nombre; i++) {
    const confetti = document.createElement("span");
    confetti.className = "confetti";
    confetti.style.left = "50vw";
    confetti.style.top = "40vh";
    confetti.style.background = couleurs[i % couleurs.length];
    confetti.style.setProperty("--dx", (Math.random() * 90 - 45) + "vw");
    confetti.style.setProperty("--dy", (30 + Math.random() * 70) + "vh");
    confetti.style.setProperty("--rotation", (Math.random() * 900 + 360) + "deg");
    confetti.style.setProperty("--duree", 2 + Math.random() * 1.5 + "s");
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

/* ════════════════════════════════════════════════════════════
   4. Génération des cartes d'activités
   ════════════════════════════════════════════════════════════ */
ACTIVITES.forEach(({ emoji, libelle }, index) => {
  const carte = document.createElement("label");
  carte.className = "carte-activite";
  carte.innerHTML = `
    <input type="checkbox" name="activites" value="${libelle} ${emoji}" id="act-${index}" />
    <span class="emoji">${emoji}</span>
    <span class="libelle">${libelle}</span>
  `;
  grilleActivites.appendChild(carte);
});

/* ════════════════════════════════════════════════════════════
   5. Envoi du formulaire → Formspree → email instantané
   ════════════════════════════════════════════════════════════ */
formDate.addEventListener("submit", async (e) => {
  e.preventDefault();

  const btnEnvoyer = $("#btn-envoyer");
  const cochees = [...formDate.querySelectorAll('input[name="activites"]:checked')]
    .map((input) => input.value);
  const autreIdee = $("#autre-idee").value.trim();

  if (cochees.length === 0 && !autreIdee) {
    statutEnvoi.textContent = "Choisis au moins une activité (ou écris ton idée) 😉";
    return;
  }

  btnEnvoyer.disabled = true;
  btnEnvoyer.textContent = "Envoi en cours… 💌";
  statutEnvoi.textContent = "";

  // Contenu de l'email reçu via Formspree
  const donnees = {
    _subject: "💖 ELLE A DIT OUI ! Nouveau date à organiser",
    reponse: "Oui 🥰",
    activites_choisies: cochees.length ? cochees.join(" | ") : "Aucune case cochée",
    autre_idee: autreIdee || "—",
    date_et_heure: new Date().toLocaleString("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
    }),
  };

  try {
    const reponse = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(donnees),
    });

    if (!reponse.ok) throw new Error("Réponse Formspree non valide");

    // Succès → célébration + écran merci
    lancerPluieDeCoeurs(30);
    ecranFormulaire.classList.remove("visible");
    ecranMerci.classList.add("visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (erreur) {
    console.error(erreur);
    statutEnvoi.textContent =
      "Oups, l'envoi a échoué. Vérifie ta connexion et réessaie 🙏";
    btnEnvoyer.disabled = false;
    btnEnvoyer.textContent = "Envoyer mon choix 💌";
  }
});

/* ════════════════════════════════════════════════════════════
   6. Compteur "Temps depuis notre rencontre"
   ════════════════════════════════════════════════════════════ */
(function lancerCompteur() {
  const cptJours    = $("#cpt-jours");
  const cptHeures   = $("#cpt-heures");
  const cptMinutes  = $("#cpt-minutes");
  const cptSecondes = $("#cpt-secondes");

  function rafraichir() {
    const ecart = Date.now() - DATE_RENCONTRE.getTime();
    if (ecart < 0) return; // date dans le futur → on n'affiche rien d'absurde

    const secondesTotales = Math.floor(ecart / 1000);
    cptJours.textContent    = Math.floor(secondesTotales / 86400);
    cptHeures.textContent   = Math.floor((secondesTotales % 86400) / 3600);
    cptMinutes.textContent  = Math.floor((secondesTotales % 3600) / 60);
    cptSecondes.textContent = secondesTotales % 60;
  }

  rafraichir();
  setInterval(rafraichir, 1000);
})();

/* ════════════════════════════════════════════════════════════
   7. Musique romantique (bouton on/off)
   Ajoute ton fichier dans assets/musique.mp3 (voir README).
   ════════════════════════════════════════════════════════════ */
const btnMusique = $("#btn-musique");
const audio = $("#audio-romantique");
const iconeMusique = $("#icone-musique");

btnMusique.addEventListener("click", async () => {
  try {
    if (audio.paused) {
      audio.volume = 0.5;
      await audio.play();
      iconeMusique.textContent = "🎶";
      btnMusique.classList.add("actif");
      btnMusique.setAttribute("aria-label", "Couper la musique");
    } else {
      audio.pause();
      iconeMusique.textContent = "🔇";
      btnMusique.classList.remove("actif");
      btnMusique.setAttribute("aria-label", "Activer la musique");
    }
  } catch {
    // Fichier audio absent ou bloqué par le navigateur
    iconeMusique.textContent = "🚫";
    setTimeout(() => (iconeMusique.textContent = "🔇"), 1500);
    console.warn("Ajoute un fichier assets/musique.mp3 pour activer la musique.");
  }
});
