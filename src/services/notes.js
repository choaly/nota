const BASE_URL = 'http://localhost:5001/api/notes';


async function getNotes() {
     const response = await fetch(BASE_URL);
     const data = await response.json();
     return data;
}

async function createNote(noteData) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: noteData.title,
            content: noteData.content
        })
    });

    const data = await response.json();
    return data;
}

async function updateNote(id, noteData) {
    const response = await fetch(BASE_URL + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: noteData.title,
            content: noteData.content
        }),
    });

    const data = await response.json();
    return data;
}

async function deleteNote(id) {
    const response = await fetch(BASE_URL + '/' + id, {
        method: 'DELETE'
    });

    const data = await response.json();
    return data;
}

export { getNotes, createNote, updateNote, deleteNote }