const url = "http://localhost:3000/notes";

export function saveToStorage(note) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note),
  })
  .then((response) => response.json());
}

export function deleteFromStorage(noteId) {
  return fetch(`${url}/${noteId}`, {
    method: 'DELETE'
  });
}

export function updateToStorage(note) {
  return fetch(`${url}/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
}

export function getNotesFromStorage() {
  return fetch(url)
    .then((response) => response.json());
}
