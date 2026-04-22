const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api/auth';

async function handleResponse(response) {
    if (response.ok) return response.json();

    // Auto-logout on expired or invalid token (but not for login/signup 401s)
    if (response.status === 401 && response.url && !response.url.includes('/login') && !response.url.includes('/signup')) {
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

async function signup(email, password) {
    const response = await fetch(BASE_URL + '/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await handleResponse(response);
    return data;
}

async function login(email, password) {
    const response = await fetch(BASE_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await handleResponse(response);
    return data;
}

async function updateProfile(email, displayName) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + '/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email, displayName })
    });

    return handleResponse(response);
}

async function changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + '/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    return handleResponse(response);
}

async function deleteAccount(password) {
    const token = localStorage.getItem('token');
    const response = await fetch(BASE_URL + '/account', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
    });

    return handleResponse(response);
}

export { signup, login, updateProfile, changePassword, deleteAccount }