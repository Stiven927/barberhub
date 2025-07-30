# BarberHub — Documentazione Backend

## Modelli (Models) del Database

### Utente
- **Campi:**
  - `id` (PK, auto-increment)
  - `email` (string, unico)
  - `password` (string, hashata)
  - `nome` (string)
  - `ruolo` (string: 'admin' o 'user')
- **Note:**
  - Ogni utente può essere admin o utente normale.
  - L’admin viene creato tramite seed.

### Cliente
- **Campi:**
  - `id` (PK, auto-increment)
  - `nome` (string)
  - `email` (string, unico)
  - `telefono` (string, opzionale)
- **Relazione:**
  - Ogni utente ha un cliente associato (1:1 logico, 1:N fisico).
  - Un cliente può avere più ordini e prenotazioni.

### Prodotto
- **Campi:**
  - `id` (PK, auto-increment)
  - `nome` (string)
  - `prezzo` (float)
  - `descrizione` (string)
  - `disponibilita` (int, stock)
- **Note:**
  - La disponibilità viene scalata ad ogni ordine.

### Ordine
- **Campi:**
  - `id` (PK, auto-increment)
  - `clienteId` (FK -> Cliente)
  - `prodottoId` (FK -> Prodotto)
  - `quantita` (int)
  - `totale` (float)
  - `pagato` (boolean, default false)
- **Relazione:**
  - Un ordine appartiene a un cliente e a un prodotto.
  - Quando viene creato un ordine, la disponibilità del prodotto viene scalata.

### Prenotazione
- **Campi:**
  - `id` (PK, auto-increment)
  - `data` (datetime, data e ora appuntamento)
  - `clienteId` (FK -> Cliente)
  - `servizio` (string: es. "Taglio", "Barba", ...)
  - `prezzo` (float)
  - `note` (string, opzionale)
- **Relazione:**
  - Una prenotazione appartiene a un cliente.
  - Gli slot sono unici per data/orario (nessun doppio booking).

---

## Servizi/Endpoint REST per ogni entità

### Utente (Auth)
- `POST /api/auth/login` — Login utente (ritorna dati utente se ok)
- `POST /api/auth/register` — Registrazione nuovo utente e cliente

### Cliente
- `GET /api/clienti` — Lista clienti
- `GET /api/clienti/:id` — Dettaglio cliente
- `POST /api/clienti` — Crea cliente
- `PUT /api/clienti/:id` — Modifica cliente
- `DELETE /api/clienti/:id` — Elimina cliente

### Prodotto
- `GET /api/prodotti` — Lista prodotti
- `GET /api/prodotti/:id` — Dettaglio prodotto
- `POST /api/prodotti` — Crea prodotto
- `PUT /api/prodotti/:id` — Modifica prodotto
- `DELETE /api/prodotti/:id` — Elimina prodotto

### Ordine
- `GET /api/ordini` — Lista ordini (con nome cliente e prodotto)
- `GET /api/ordini/:id` — Dettaglio ordine
- `POST /api/ordini` — Crea ordine (richiede clienteId, prodottoId, quantita; scala disponibilità prodotto)
- `PUT /api/ordini/:id` — Modifica ordine
- `DELETE /api/ordini/:id` — Elimina ordine

### Prenotazione
- `GET /api/prenotazioni` — Lista prenotazioni (con nome cliente, servizio, prezzo, orario)
- `GET /api/prenotazioni/:id` — Dettaglio prenotazione
- `POST /api/prenotazioni` — Crea prenotazione (richiede data, clienteId, servizio, prezzo; blocca slot già occupati)
- `PUT /api/prenotazioni/:id` — Modifica prenotazione
- `DELETE /api/prenotazioni/:id` — Elimina prenotazione

---

## Logica e vincoli principali
- **Autenticazione:** semplice, sessione lato FE, nessun JWT.
- **Relazioni:** tutte le FK sono enforce da Sequelize e MySQL.
- **Slot prenotazione:** controllo FE e BE per evitare doppie prenotazioni su stesso slot.
- **Stock prodotti:** scalato automaticamente ad ogni ordine.
- **Admin:** può gestire tutto da dashboard.

---

## Seed admin
- Esegui `node src/seed_admin.js` per creare utente admin e cliente associato.

---

## Estensioni possibili
- Aggiunta JWT per sicurezza.
- Notifiche email/SMS per prenotazioni.
- Statistiche avanzate per admin.

---

Per dettagli su ogni modello, vedi i file in `src/models/`.
Per la logica API, vedi le route in `src/routes/`.
