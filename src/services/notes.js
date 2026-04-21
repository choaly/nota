const BASE_URL = 'http://localhost:5001/api/notes';

async function handleResponse(response) {
    if (response.ok) return response.json();

    // Auto-logout on expired or invalid token
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        return;
    }

    let data;
    try {
        data = await response.json()
    } catch(error) {
        throw new Error("Request failed");
    }

    throw new Error(data.message);
}


async function getNotes() {
    const token = localStorage.getItem('token'); 
    const response = await fetch(BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await handleResponse(response);
    return data;
}

async function createNote(noteData) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: noteData.title,
            content: noteData.content
        })
    });

    const data = await handleResponse(response);
    return data;
}

async function updateNote(id, noteData) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: noteData.title,
            content: noteData.content
        }),
    });

    const data = await handleResponse(response);
    return data;
}

async function deleteNote(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + '/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await handleResponse(response);
    return data;
}

export { getNotes, createNote, updateNote, deleteNote }