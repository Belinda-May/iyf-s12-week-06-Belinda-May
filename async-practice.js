
/* =====================================
   1. CREATE A PROMISE
===================================== */

function getMessage() {
    return new Promise((resolve, reject) => {

        const success = true;

        setTimeout(() => {
            if (success) {
                resolve("Promise resolved successfully!");
            } else {
                reject("Something went wrong!");
            }
        }, 2000);

    });
}


/* =====================================
   2. HANDLE PROMISE WITH THEN AND CATCH
===================================== */

getMessage()
    .then(message => {
        console.log(message);
    })
    .catch(error => {
        console.error(error);
    });


/* =====================================
   3. USE ASYNC/AWAIT
===================================== */

async function displayMessage() {

    try {
        const message = await getMessage();
        console.log("Using async/await:", message);

    } catch (error) {
        console.error("Error:", error);
    }

}

displayMessage();


/* =====================================
   4. FETCH DATA USING ASYNC/AWAIT
===================================== */

async function fetchPosts() {

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts/1"
        );

        if (!response.ok) {
            throw new Error("Unable to fetch posts.");
        }

        const post = await response.json();

        console.log("Fetched post:", post);

    } catch (error) {
        console.error("Fetch error:", error);
    }

}

fetchPosts();
