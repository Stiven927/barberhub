import React, { useEffect, useState } from 'react';

const orariDisponibili = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
];

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// helper: ottiene HH:MM per una Date rispettando timezone Europe/Rome
function timeHHMMInRome(date) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(date);
    return parts.slice(0,5).trim();
  } catch (e) {
    return '';
  }
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
      })
      .catch(() => setLoading(false));
  }, []);

  // Orari già prenotati per la data selezionata (uso Intl per evitare problemi di localizzazione)
  const occupati = prenotazioni
    .filter(p => {
      const d = new Date(p.data);
      const giorno = d.toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' });
      return giorno === date;
    })
    .map(p => timeHHMMInRome(new Date(p.data)))
    .map(t => (t || '').trim())
    .filter(Boolean);

  // Helper: determina se un orario è già passato rispetto al tempo corrente in Europe/Rome
  const isPastSlot = (selectedDate, slot) => {
    const todayRome = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Rome' });
    if (selectedDate !== todayRome) return false;
    const nowRome = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(new Date()).slice(0,5);
    const toMinutes = t => {
      const parts = ('' + t).split(':').map(s => parseInt(s, 10) || 0);
      return parts[0] * 60 + parts[1];
    };
    return toMinutes(slot) <= toMinutes(nowRome);
  };

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
            const normalizedOrario = orario.trim();
            const isOccupato = occupati.includes(normalizedOrario);
            const isPast = isPastSlot(date, normalizedOrario);
            const disabled = isOccupato || isPast;
            // occupied -> red, past -> gray, available -> outline-primary
            const btnClass = isOccupato ? 'btn-danger' : (isPast ? 'btn-secondary' : 'btn-outline-primary');
            return (
              <div className="col-4 col-md-2" key={orario}>
                <button
                  className={`btn btn-sm w-100 ${btnClass}`}
                  disabled={disabled}
                  onClick={() => onSelect(date, normalizedOrario)}
                  title={isPast ? 'Orario passato' : isOccupato ? 'Orario occupato' : `Seleziona ${normalizedOrario}`}
                >
                  {normalizedOrario}
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
