export async function fetchPost(url, data) {
    //console.log(process.env.NODE_ENV);
    let baseurl;
    switch (process.env.NODE_ENV) {
        case 'production':
            baseurl = process.env.REACT_APP_URI_PRODUCTION;
            break;
        case 'development':
        default:
            baseurl = process.env.REACT_APP_URI_DEVELOPMENT;
    }
    try {
        const response = await fetch(baseurl + url, {
            method: "POST", // or 'PUT'
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function fetchGet(url) {
    let baseurl;
    switch (process.env.NODE_ENV) {
        case 'production':
            baseurl = process.env.REACT_APP_URI_PRODUCTION;
            break;
        case 'development':
        default:
            baseurl = process.env.REACT_APP_URI_DEVELOPMENT;
    }
    try {
        const response = await fetch(baseurl + url, {
            method: "GET", // or 'PUT'
            credentials: "include",
            headers: {
                'Accept': 'application/json',
                //"Content-Type": "application/json",
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}