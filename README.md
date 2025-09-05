# BarberHub — Documentazione dettagliata

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

Note: il progetto usa Sequelize sync per creare le tabelle all'avvio (controlla `src/models/index.js`). Per produzione preferisci migration tools.

---

## Configurazione frontend
1. `cd frontend`
2. `npm install`
3. Configura endpoint API se diverso da default: nel codice le chiamate puntano a `http://localhost:5200`; modifica le chiamate o imposta una variabile d'ambiente se necessario.
4. Avvia: `npm start` (sviluppo)

---

## Mappatura servizi e prezzi
Il prezzo del servizio viene calcolato e imposto dal server per sicurezza (non fidarti del prezzo inviato dal client). Nel backend, in `backend/src/routes/prenotazioni.js`, è presente una mappa del tipo:

- Taglio => X€
- Taglio + Barba => Y€
- Solo Barba => Z€
- Tinta => W€

(Controlla il file per i valori esatti). Quando si crea o aggiorna una prenotazione il server sostituisce il campo `prezzo` con il valore della mappa.

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

Nota: attualmente la protezione lato server (middleware che obbliga ruolo admin per PUT/DELETE) è raccomandata ma può non essere presente ovunque: valuta di aggiungerla come prossimo passo.

---

## Debug: perché nel calendario vedi tutti i pulsanti rossi (occupati)
Se nel calendario tutti gli orari risultano come "occupati" (rossi), le cause comuni sono:
1. Il backend restituisce date/ore con un formato o offset diversi da quanto il frontend si aspetta.
2. La normalizzazione data/ora (comparazione) fallisce per colpa della localizzazione o di caratteri invisibili.

Cosa ho corretto nel frontend:
- Ho aggiornato `frontend/src/components/BookingCalendar.js` per usare Intl.DateTimeFormat con timezone `Europe/Rome` e formati stabili (`en-CA` per YYYY-MM-DD e `en-GB` per HH:MM). Inoltre la lista `occupati` ora viene normalizzata a `HH:MM` e filtrata prima del confronto.

Cosa verificare subito:
- Apri DevTools → Network → fai la richiesta GET `/api/prenotazioni` e guarda la risposta. Controlla il campo `data` delle prenotazioni; deve essere una stringa ISO valida (es. `2025-09-04T15:30:00.000Z` o con offset). Se il valore è diverso o contiene testo aggiuntivo, adattare la conversione lato frontend o backend.
- Se vuoi vedere direttamente i dati, nella pagina Prenota apri la Console e cerca `occupati` o aggiungi temporaneamente nel componente un dump JSON di `prenotazioni` (solo per debug).

Soluzioni se il problema persiste:
- Assicurati che `p.data` sia una stringa interpretabile da `new Date(p.data)`; se non lo è modifica il backend per inviare un ISO string.
- Se il backend memorizza orario separato, aggiorna la logica del frontend per leggere quel campo (es. `p.orario`).
- Se le date arrivano in un timezone differente e vuoi forzarle a Europe/Rome, converti sul server o usa libreria come luxon/moment-timezone per normalizzare.

---

## Test manuale rapido (verifica fix calendario)
1. Avvia backend e frontend.
2. Vai su pagina Prenota → apri DevTools → Network → refresh.
3. Controlla risposta GET `/api/prenotazioni`: prendi un oggetto `data` e prova in console: `new Date('VALORE')` → verificare che restituisca la data corretta.
4. Sempre in console: esegui

```js
const d = new Date('VALORE');
d.toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' }); // deve restituire YYYY-MM-DD
new Intl.DateTimeFormat('en-GB', { hour:'2-digit', minute:'2-digit', timeZone:'Europe/Rome' }).format(d) // HH:MM
```

Se questi due valori coincidono con la data selezionata e con uno degli orari disponibili (`09:00`, `09:30`, ecc.) allora il pulsante non sarà rosso.

---

## Note di sicurezza e produzione
- Non fidarti dei prezzi inviati dal client: la logica di calcolo prezzo è già lato server, non revocare questa decisione.
- Implementare autenticazione robusta (JWT o sessioni sicure) e middleware server per autorizzare azioni admin (PUT/DELETE su prenotazioni/prodotti/ordini).
- Abilitare HTTPS in produzione, configurare CORS in modo restrittivo.
- Per il DB usare migration scripts (sequelize-cli) anziché `sync({force:true})` in produzione.

---

## Cose da fare (roadmap suggerita)
- Aggiungere middleware di autorizzazione lato backend per bloccare PUT/DELETE agli utenti non admin.
- Normalizzare la forma della risposta `GET /api/ordini` per avere sempre array di item con `nome`, `quantita`, `prezzo`.
- Aggiungere test end-to-end per flusso prenotazione/ordine.
- Aggiungere logging centrale e gestione errori migliorata in backend.

---

## Contribuire
- Fork, branch feature, pull request con descrizione e test.
- Seguire lo stile esistente (JavaScript ES6, React functional components).

---

## Autore
Progetto BarberHub — (sviluppato localmente). Per domande o aiuto contatta il maintainer del repository.

---

(Questa README può essere ulteriormente personalizzata con esempi di API reali, screenshot e comandi di deployment CI/CD.)
