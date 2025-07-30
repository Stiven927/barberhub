# BarberHub

BarberHub è un gestionale completo per barbieri, con frontend React e backend Node.js/Express, pensato per gestire prenotazioni, prodotti, ordini e amministrazione.

---

## Backend (Node.js + Express + MySQL)

### Funzionalità principali
- **Gestione utenti**: Registrazione, login, autenticazione, ruolo admin.
- **Clienti**: Ogni utente ha un cliente associato.
- **Prodotti**: CRUD prodotti, gestione disponibilità (stock), acquisto prodotti.
- **Ordini**: Creazione ordini, associazione cliente/prodotto, scalatura automatica disponibilità.
- **Prenotazioni**: Gestione appuntamenti con calendario, slot orari unici per data, servizi e prezzi fissi.
- **Admin**: Seed utente admin, dashboard ordini/prenotazioni/prodotti.

### Struttura cartelle
- `backend/src/models/` — Modelli Sequelize: Utente, Cliente, Prodotto, Ordine, Prenotazione, associazioni.
- `backend/src/routes/` — API REST: autenticazione, clienti, prodotti, ordini, prenotazioni.
- `backend/src/seed_admin.js` — Script per creare utente admin e cliente associato.
- `backend/package.json` — Dipendenze backend.

### Avvio backend
1. Installa le dipendenze:
   ```sh
   cd backend
   npm install
   ```
2. Configura il database MySQL (modifica credenziali in `src/models/index.js` se necessario).
3. Avvia il backend:
   ```sh
   npm start
   ```
4. (Facoltativo) Esegui lo script di seed admin:
   ```sh
   node src/seed_admin.js
   ```

### Note tecniche
- Tutte le tabelle vengono create automaticamente da Sequelize.
- Gli slot prenotazione sono unici per data/orario (nessun doppio booking).
- La disponibilità prodotto viene scalata ad ogni ordine.
- Le API sono protette lato frontend, ma non c'è JWT: per produzione aggiungere autenticazione avanzata.

---

## Frontend (React + Bootstrap + SCSS)

### Funzionalità principali
- **Home page**: Card per accesso rapido a prodotti, prenotazioni, contatti.
- **Prodotti**: Lista prodotti, dettaglio, acquisto con aggiornamento disponibilità in tempo reale.
- **Prenotazioni**: Calendario con slot orari, selezione servizio, prezzo fisso, blocco slot già occupati, impossibile prenotare date passate.
- **Login/Registrazione**: Gestione utente, login persistente (localStorage).
- **Admin**: Dashboard con 3 sezioni (ordini, prenotazioni, prodotti), visibili una alla volta tramite bottoni.
- **Responsive**: Layout ottimizzato per desktop e mobile.

### Struttura cartelle
- `frontend/src/pages/` — Pagine principali: Home, Prodotti, Prenota, Login, Registrati, Admin, ecc.
- `frontend/src/components/` — Componenti riutilizzabili: Header, Footer, BookingCalendar, AdminOrdini, AdminCalendar, AdminProdotti.
- `frontend/src/custom.scss` — Stili personalizzati e palette BarberHub.
- `frontend/package.json` — Dipendenze frontend.

### Avvio frontend
1. Installa le dipendenze:
   ```sh
   cd frontend
   npm install
   ```
2. Avvia il frontend:
   ```sh
   npm start
   ```

### Note tecniche
- Tutte le chiamate API puntano a `http://localhost:5200` (modifica se necessario).
- Gli slot prenotazione sono disabilitati se già occupati o se la data è passata.
- La quantità prodotto è gestita separatamente per ogni prodotto.
- Il pannello admin mostra una sola sezione alla volta (ordini, prenotazioni, prodotti).

---

## Flusso tipico utente
1. L’utente si registra o accede.
2. Può acquistare prodotti (la disponibilità si aggiorna in tempo reale).
3. Può prenotare un appuntamento scegliendo data, orario e servizio (slot unici).
4. L’admin accede al pannello e gestisce ordini, prenotazioni e prodotti da un’unica dashboard.

---

## Personalizzazioni e sviluppo
- Tutto il codice è facilmente estendibile.
- Per modifiche grafiche, agire su `custom.scss`.
- Per nuove API, aggiungere route in `backend/src/routes/` e modelli in `backend/src/models/`.

---

## Autore
BarberHub — gestionale per barbieri, sviluppato con ❤️ e attenzione all’usabilità.
