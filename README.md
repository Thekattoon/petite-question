# 💖 Veux-tu partir en date avec moi ?

Site web romantique en une page — HTML / CSS / JavaScript vanilla.
Aucune dépendance, aucun build : déployable en 2 minutes.

---

## 📁 Arborescence

```
date-avec-moi/
├── index.html        ← structure de la page
├── style.css         ← design "Soir parisien" (responsive)
├── script.js         ← toute la logique + ⚙️ CONFIGURATION ICI
├── assets/
│   └── musique.mp3   ← (optionnel) ta musique romantique
└── README.md
```

---

## ⚙️ 1. Les 2 variables à modifier (en haut de `script.js`)

```js
// 1️⃣ Ton endpoint Formspree (voir section Notifications ci-dessous)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/REMPLACE_MOI";

// 2️⃣ Date de votre rencontre — ⚠️ les mois commencent à 0 (0 = janvier)
const DATE_RENCONTRE = new Date(2024, 1, 14, 20, 30); // 14 février 2024, 20h30
```

C'est tout. Le reste fonctionne tel quel.

---

## 💌 2. Recevoir les notifications (Formspree — 3 minutes)

Formspree est la solution la plus simple : **aucune clé API dans le code**,
plan gratuit (50 envois/mois, largement suffisant ici 😄), email instantané.

1. Va sur **https://formspree.io** → *Sign up* (gratuit).
2. Clique **+ New form** → donne-lui un nom (ex. `date-maeva`) →
   l'email de réception est le tien par défaut.
3. Formspree affiche ton endpoint, du type :
   `https://formspree.io/f/abcdwxyz`
4. Copie cette URL dans `script.js` à la place de
   `https://formspree.io/f/REMPLACE_MOI`.
5. ⚠️ **Premier envoi** : Formspree t'envoie un email de confirmation —
   clique sur le lien pour activer le formulaire. Fais donc **un test
   toi-même avant de lui envoyer le lien**.

### Ce que tu recevras par email à chaque envoi

| Champ              | Contenu                                  |
|--------------------|------------------------------------------|
| Sujet              | 💖 ELLE A DIT OUI ! Nouveau date à organiser |
| reponse            | Oui 🥰                                    |
| activites_choisies | Liste des cartes cochées                  |
| autre_idee         | Le texte libre (ou —)                     |
| date_et_heure      | Date et heure de l'envoi (format FR)      |

> Astuce : active les **notifications push de ta boîte mail** sur ton
> téléphone pour être prévenu "instantanément".

### Alternative : Discord Webhook (si tu préfères)
Dans `script.js`, remplace le `fetch` de la section 5 par :
```js
await fetch("TON_WEBHOOK_DISCORD", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: `💖 ELLE A DIT OUI !\nActivités : ${donnees.activites_choisies}\nAutre idée : ${donnees.autre_idee}\n🕐 ${donnees.date_et_heure}`,
  }),
});
```
(Webhook à créer dans Discord : Paramètres du salon → Intégrations → Webhooks.)
⚠️ Le webhook sera visible dans le code source public — pour un site
perso éphémère c'est acceptable, sinon préfère Formspree.

---

## 🎵 3. Musique (optionnel)

Place un fichier MP3 dans `assets/musique.mp3` (utilise une musique
libre de droits, ex. depuis Pixabay Music). Sans fichier, le bouton 🔇
affiche simplement 🚫 — rien ne casse.

---

## 🧪 4. Tester en local

Aucune installation requise. Au choix :

```bash
# Option A : ouvrir directement
# → double-clique sur index.html

# Option B : petit serveur local (recommandé pour tester le fetch)
cd date-avec-moi
python3 -m http.server 8080
# puis ouvre http://localhost:8080
```

---

## 🚀 5. Déploiement

### Vercel (recommandé)

```bash
npm install -g vercel
cd date-avec-moi
vercel          # connexion + déploiement preview
vercel --prod   # déploiement production
```
→ Tu obtiens une URL du type `https://date-avec-moi.vercel.app`.

*(Sans terminal : vercel.com → Add New Project → glisse-dépose le dossier.)*

### Netlify (le plus rapide, zéro compte CLI)

1. Va sur **https://app.netlify.com/drop**
2. Glisse-dépose le dossier `date-avec-moi`
3. C'est en ligne. ✅

### GitHub Pages

```bash
cd date-avec-moi
git init && git add . && git commit -m "💖 first commit"
git branch -M main
git remote add origin https://github.com/TON_USER/date-avec-moi.git
git push -u origin main
```
Puis : repo → **Settings → Pages → Source : main / root → Save**.
URL : `https://TON_USER.github.io/date-avec-moi/`

---

## ✅ Checklist avant d'envoyer le lien

- [ ] Endpoint Formspree remplacé dans `script.js`
- [ ] Email de confirmation Formspree validé (après TON test)
- [ ] `DATE_RENCONTRE` mise à jour
- [ ] Test complet sur ton téléphone (le bouton Non doit fuir 😈)
- [ ] (Optionnel) `assets/musique.mp3` ajouté

Bonne chance — enfin, elle ne pourra dire que oui de toute façon 😏
