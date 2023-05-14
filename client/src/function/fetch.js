export async function fetchPost(url, data) {
    let baseurl = getBaseURL();
    try {
        const response = await fetch(baseurl + url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
                "Authorization": "Bearer " + window.localStorage.getItem('Token'),
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let RTresult = await refreshToken()
            if (RTresult.auth) {
                window.localStorage.setItem('Token', RTresult.accessToken);
                return fetchPost(url, data);
            } else {
                return RTresult;
            }
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function fetchGet(url) {
    let baseurl = getBaseURL();
    try {
        const response = await fetch(baseurl + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('Token'),
            },
        });
        if (!response.ok) {
            let RTresult = await refreshToken()
            if (RTresult.auth) {
                window.localStorage.setItem('Token', RTresult.accessToken);
                return fetchGet(url);
            } else {
                return RTresult;
            }
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function refreshToken() {
    let baseurl = getBaseURL();
    let refreshToken = window.localStorage.getItem('RefreshToken');
    //let result = await fetchPost('/token', { token: refreshToken });
    const response = await fetch(baseurl + '/token', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            "Authorization": "Bearer " + window.localStorage.getItem('Token'),
        },
        body: JSON.stringify({ token: refreshToken }),
    });
    const result = await response.json();
    return result;
}

function getBaseURL() {
    let baseurl;
    switch (process.env.NODE_ENV) {
        case 'production':
            baseurl = process.env.REACT_APP_URI_PRODUCTION;
            break;
        case 'development':
        default:
            baseurl = process.env.REACT_APP_URI_DEVELOPMENT;
    }
    return baseurl;
}