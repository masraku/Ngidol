'use client';

import { guestOptions } from '@/data/guestOptions';
import Image from 'next/image';
import { X } from 'react-bootstrap-icons';

export default function GuestSelector({ selected, setSelected }) {
  const isSelected = (name) =>
    Array.isArray(selected) && selected.includes(name);

  const toggleGuest = (name) => {
    if (!Array.isArray(selected)) {
      setSelected([name]);
    } else {
      setSelected(
        selected.includes(name)
          ? selected.filter((g) => g !== name)
          : [...selected, name]
      );
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {guestOptions.map((guest) => (
          <div
            key={guest.name}
            className={`d-flex align-items-center p-2 px-3 border rounded-pill shadow-sm ${
              isSelected(guest.name)
                ? 'bg-primary text-white border-primary'
                : 'bg-light text-dark border-secondary'
            }`}
            style={{
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              transform: isSelected(guest.name) ? 'scale(1.05)' : 'scale(1)',
            }}
            onClick={() => toggleGuest(guest.name)}
          >
            <Image
              src={guest.image}
              alt={guest.name}
              width={30}
              height={30}
              className="me-2 rounded-circle border"
            />
            <span className="fw-semibold">{guest.name}</span>
          </div>
        ))}
      </div>

      {Array.isArray(selected) && selected.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {selected.map((name) => (
            <span key={name} className="badge bg-secondary p-2">
              {name}{' '}
              <X
                size={14}
                className="ms-1"
                role="button"
                onClick={() =>
                  setSelected(selected.filter((g) => g !== name))
                }
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
