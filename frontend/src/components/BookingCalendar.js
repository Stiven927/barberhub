import React, { useEffect, useState } from 'react';

const orariDisponibili = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
];

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

const BookingCalendar = ({ onSelect }) => {
  const [date, setDate] = useState(formatDate(new Date()));
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5200/api/prenotazioni')
      .then(res => res.json())
      .then(data => {
        setPrenotazioni(data);
        setLoading(false);
      });
  }, []);

  // Orari già prenotati per la data selezionata (confronto robusto locale)
  const occupati = prenotazioni
    .filter(p => {
      // Prendi la data locale (Europe/Rome) della prenotazione
      const d = new Date(p.data);
      const giorno = d.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome' }).split('/').reverse().join('-');
      return giorno === date;
    })
    .map(p => {
      const d = new Date(p.data);
      return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    });

  return (
    <div className="card p-3 shadow-sm mb-4">
      <h5 className="mb-3">Seleziona data e orario</h5>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={date}
          min={formatDate(new Date())}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      {loading ? <div>Caricamento orari...</div> : (
        <div className="row g-2">
          {orariDisponibili.map(orario => {
            const isOccupato = occupati.includes(orario);
            return (
              <div className="col-4 col-md-2" key={orario}>
                <button
                  className={`btn btn-sm w-100 ${isOccupato ? 'btn-secondary' : 'btn-outline-primary'}`}
                  disabled={isOccupato}
                  onClick={() => onSelect(date, orario)}
                >
                  {orario}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
