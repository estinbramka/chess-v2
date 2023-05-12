export async function fetchPost(url, data) {
    try {
        const response = await fetch(url, {
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

export async function fetchGet(url){
    try {
        const response = await fetch(url, {
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