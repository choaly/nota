const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/explain';

async function handleResponse(response) {
    if (response.ok) return response.json();

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    }

    let data;
    try {
        data = await response.json();
    } catch(error) {
        throw new Error("Request failed");
    }

    throw new Error(data.message);
}

async function generateExplainQuestions(noteContent) {
    const token = localStorage.getItem('token');

    const response = await fetch(BASE_URL + '/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: noteContent })
    });

    return handleResponse(response);
}

async function evaluateExplanation(question, userAnswer, keyConcepts, sampleAnswer) {
    const token = localStorage.getItem('token');

    const response = await fetch(BASE_URL + '/evaluate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question, userAnswer, keyConcepts, sampleAnswer })
    });

    return handleResponse(response);
}

export { generateExplainQuestions, evaluateExplanation }
