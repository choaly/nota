const BASE_URL = 'http://localhost:5001/api/quiz';

async function handleResponse(response) {
    if (response.ok) return response.json();

    let data;
    try {
        data = await response.json()
    } catch(error) {
        throw new Error("Request failed");
    }

    throw new Error(data.message);
}

async function generateQuiz(noteContent) {
    const token = localStorage.getItem('token');

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            content: noteContent
        })
    })

    const data = await handleResponse(response);
    return data;
}

export { generateQuiz }