# Valentine – Administration du Cupidon, Guichet n°7

Quiz interactif Saint-Valentin en style BD/comic. Multi-tenant par sous-domaine.

## Architecture

```
valentine/
├── docker-compose.yml
├── backend/          # Node.js + Express + Mongoose
│   └── src/
│       ├── index.js
│       ├── storage.js          # Mongo ou fallback fichier JSON
│       ├── middleware/tenant.js
│       ├── models/submission.js
│       └── routes/api.js
└── frontend/         # Angular 19 standalone
    └── src/app/
        ├── components/   # landing, quiz, bureau-refus, contract, signature, done
        ├── services/     # tenant, quiz, api
        └── data/         # questions
```

## Multi-tenant

L'URL `juliette.valentine.dgsynthex.online` extrait le tenant `juliette`.
- Frontend : `window.location.hostname.split('.')[0]`
- Backend : `req.hostname.split('.')[0]`
- Localhost → tenant `demo`

## Prérequis

- Node.js 20+
- npm 9+
- Docker & Docker Compose (pour le déploiement)

## Run local (dev)

### Backend

```bash
cd backend
npm install
npm run dev
# → http://localhost:3000 (API)
# Sans MongoDB, utilise le stockage fichier ./data/submissions.json
```

### Frontend

```bash
cd frontend
npm install
npm start
# → http://localhost:4200
# Le proxy.conf.json redirige /api vers localhost:3000
```

## Run avec Docker Compose

```bash
docker compose up --build
# → http://localhost (frontend + API + MongoDB)
```

## API

| Méthode | Route         | Description                |
|---------|---------------|----------------------------|
| GET     | /api/health   | Health check               |
| POST    | /api/submit   | Soumettre le dossier final |

### POST /api/submit

```json
{
  "tenant": "juliette",
  "answers": [true, true, true, true, true, true, true, true, true, true],
  "contract": {
    "name": "Juliette",
    "nickname": "Mon chou",
    "romanticLevel": 4,
    "bonusCompliment": true,
    "bonusSurprise": true,
    "bonusDate": false,
    "stamp": "APPROUVÉ 💘"
  },
  "signature": "data:image/png;base64,...",
  "userAgent": "...",
  "timestamp": "2025-02-14T10:00:00.000Z"
}
```

## Parcours utilisateur

1. **/** – Landing (intro BD avec prénom du tenant)
2. **/quiz** – 10 questions Oui/Non avec « Bureau des refus » comique
3. **/contract** – Formulaire contrat officiel
4. **/sign** – Signature canvas tactile ou texte
5. **/done** – Résultat + surprise
