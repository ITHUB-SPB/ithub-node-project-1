const form = document.querySelector('#bookingForm');
const clientErrors = document.querySelector('#clientErrors');
const slotsContainer = document.querySelector('#availableSlots');

function showClientErrors(errors) {
  if (!clientErrors) {
    return;
  }

  clientErrors.innerHTML = '';

  if (errors.length === 0) {
    clientErrors.classList.add('form-errors--hidden');
    return;
  }

  errors.forEach((error) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = error;
    clientErrors.appendChild(paragraph);
  });

  clientErrors.classList.remove('form-errors--hidden');
}

if (form) {
  form.addEventListener('submit', (event) => {
    const title = form.elements.title.value.trim();
    const organizer = form.elements.organizer.value.trim();
    const start = form.elements.start.value;
    const end = form.elements.end.value;

    const errors = [];

    if (title.length < 2) {
      errors.push('Тема должна быть не короче 2 символов');
    }

    if (organizer.length < 2) {
      errors.push('Организатор должен быть не короче 2 символов');
    }

    if (!start || !end) {
      errors.push('Укажите начало и конец бронирования');
    }

    if (start && end && start >= end) {
      errors.push('Время окончания должно быть позже времени начала');
    }

    if (errors.length > 0) {
      event.preventDefault();
      showClientErrors(errors);
    }
  });
}

if (slotsContainer) {
  const roomId = slotsContainer.dataset.roomId;

  fetch(`/api/rooms/${roomId}/available-slots`)
    .then((response) => response.json())
    .then((data) => {
      slotsContainer.innerHTML = '';

      if (!data.slots || data.slots.length === 0) {
        slotsContainer.textContent = 'Свободных слотов нет';
        return;
      }

      data.slots.forEach((slot) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'slot-button';
        button.textContent = `${slot.start} - ${slot.end}`;

        button.addEventListener('click', () => {
          form.elements.start.value = slot.start;
          form.elements.end.value = slot.end;
        });

        slotsContainer.appendChild(button);
      });
    })
    .catch(() => {
      slotsContainer.textContent = 'Не удалось загрузить свободные слоты';
    });
}