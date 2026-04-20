// test-strapi.js
const STRAPI_URL = 'https://lionfish-app-4fpv2.ondigitalocean.app';
const path = 'home-page';
const options = { populate: '*' };

async function fetchStrapi(path, options) {
    const params = new URLSearchParams();
    if (options.populate) {
        params.append('populate', options.populate);
    }
    const urlQuery = params.toString() ? '?' + params.toString() : '';
    // Fix double slash issue if exists
    const baseUrl = STRAPI_URL.endsWith('/') ? STRAPI_URL.slice(0, -1) : STRAPI_URL;
    const url = baseUrl + '/api/' + path + urlQuery;
    
    console.log("Fetching URL:", url);
    
    try {
        const res = await fetch(url);
        console.log("Status:", res.status);
        if (!res.ok) {
            console.log("Response text:", await res.text());
            return;
        }
        const json = await res.json();
        console.log("Data keys:", Object.keys(json));
        console.log("Data:", json.data !== undefined ? "Found" : "Not Found");
        if(json.data) {
             console.log("hero_badge", json.data.hero_badge);
        }
    } catch(e) {
        console.error("Fetch failed", e);
    }
}

fetchStrapi(path, options);
