import React from 'react';
import EventCard from './eventCard';

export default function CarteleraGrid({ events = [], onView = () => {} }) {
  if (!events || events.length === 0) {
    return (
      <div className="container">
        <div className="card center" style={{ padding: 40 }}>
          No hay eventos cargados
        </div>
      </div>
    );
  }

  const normalized = events.map((ev, i) => ({
    id: ev.id ?? ev._id ?? `e${i}`,
    title: ev.title ?? ev.name ?? ev.titulo ?? 'Evento sin título',
    date: ev.date ?? ev.fecha ?? ev.horario ?? 'Fecha por confirmar',
    place: ev.place ?? ev.lugar ?? ev.venue ?? 'Por confirmar',
    price: ev.price ?? ev.precio ?? (ev.ticketPrice ? `$${ev.ticketPrice}` : 'Consultar'),
    img: ev.img ?? ev.image ?? '',
    tags: ev.tags ?? ev.categorias ?? []
  }));

  return (
    <section className="grid" style={{ marginTop: 6 }}>
      {normalized.map(ev => (
        <EventCard
          key={ev.id}
          {...ev}
          onView={() => onView(ev.id)}
        />
      ))}
    </section>
  );
}
