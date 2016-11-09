export function checkStatus (res) {
    if (res.status >= 200 && res.status < 300) {
        return res;
    } else {
        var error = new Error(res.statusText);
        error.res = res;
        throw error;
    }
}

export function parseJSON (res) {
    return res.json();
}
