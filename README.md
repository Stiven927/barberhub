# BarberHub — Read Me

## Panoramica
BarberHub è un'applicazione full‑stack per la gestione di un salone da barba: prenotazioni, vendita prodotti, ordini e pannello amministrazione. Frontend in React e backend in Node.js/Express con database MySQL attraverso Sequelize.

Questa README descrive come configurare, eseguire, sviluppare e distribuire l'applicazione, oltre a fornire informazioni tecniche utili per debugging (in particolare sul calendario di prenotazione).

---

## Tecnologie principali
- Backend: Node.js, Express, Sequelize ORM, MySQL
- Frontend: React, react-router, Bootstrap (solo CSS), SCSS
- Altre: Fetch API (frontend), localStorage per sessione utente (frontend)

---

## Requisiti
- Node.js >= 16
- npm o yarn
- MySQL disponibile (o MariaDB compatibile)
- Git (consigliato)

---

## Struttura del progetto
- `backend/` — codice server (API, modelli, seed)
  - `src/models/` — modelli Sequelize (Utente, Cliente, Prodotto, Ordine, Prenotazione, associazioni)
  - `src/routes/` — route REST (`auth.js`, `prenotazioni.js`, `prodotti.js`, `ordini.js`, `clienti.js`, `index.js`)
  - `seed_admin.js` — script per creare un utente admin di default
- `frontend/` — app React
  - `src/pages/` — pagine (Home, Prenota, Prodotti, Admin, Profilo ecc.)
  - `src/components/` — componenti (BookingCalendar, Header, ConfirmationModal, Admin* ecc.)
  - `src/custom.scss` — stili personalizzati

---

## Configurazione backend
1. Copia/crea un file `.env` nella cartella `backend/` (se il progetto non usa dotenv direttamente, imposta i parametri dove necessario in `src/models/index.js`). Valori tipici:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=barberhub_dev
DB_USER=root
DB_PASS=secret
PORT=5200
```

2. Installa dipendenze e avvia:
- `cd backend`
- `npm install`
- Assicurati che MySQL sia attivo e che le credenziali siano corrette.
- Avvia il server: `npm start` (oppure `node src/app.js` a seconda dello script in package.json)

3. Seed admin (facoltativo ma consigliato per test):
- `node src/seed_admin.js` — creerà un utente admin e il cliente associato.

Note: il progetto usa Sequelize sync per creare le tabelle all'avvio (controlla `src/models/index.js`).

---

## Configurazione frontend
1. `cd frontend`
2. `npm install`
3. Configura endpoint API se diverso da default: nel codice le chiamate puntano a `http://localhost:5200`; modifica le chiamate o imposta una variabile d'ambiente se necessario.
4. Avvia: `npm start` (sviluppo)

---

## Mappatura servizi e prezzi
Il prezzo del servizio viene calcolato e imposto dal server per sicurezza. Nel backend, in `backend/src/routes/prenotazioni.js`, è presente una mappa del tipo:

- Taglio => X€
- Taglio + Barba => Y€
- Solo Barba => Z€
- Tinta => W€


---

## API principali (breve riferimento)
- GET /api/prodotti — lista prodotti
- POST /api/prodotti — crea prodotto (admin)
- PUT /api/prodotti/:id — aggiorna prodotto (admin)
- DELETE /api/prodotti/:id — elimina prodotto (admin)
- DELETE /api/prodotti/all — elimina tutti i prodotti (usato per pulizia demo)
- GET /api/prenotazioni — lista prenotazioni
- POST /api/prenotazioni — crea prenotazione (il server valida servizio e imposta prezzo)
- PUT /api/prenotazioni/:id — modifica prenotazione (server ricalcola prezzo se cambia servizio)
- DELETE /api/prenotazioni/:id — elimina prenotazione (admin)
- GET /api/ordini — lista ordini
- POST /api/ordini — crea ordine (aggiorna disponibilità prodotti)


---

## Autore
Progetto BarberHub — (sviluppato localmente). 

---
