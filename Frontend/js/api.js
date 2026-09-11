async function getData() {
    const url = "http://127.0.0.1:8000/api/v1/home/";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        window.location.href = "books.html";
    } catch (error) {
        console.error(error.message);
    }
}