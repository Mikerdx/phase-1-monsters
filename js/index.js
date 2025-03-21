document.addEventListener("DOMContentLoaded", () => {
    // Select necessary elements from the HTML
    const monsterContainer = document.getElementById("monster-container"); // Where monsters will be displayed
    const createMonsterForm = document.getElementById("create-monster"); // The form for creating new monsters
    const loadMoreButton = document.getElementById("load-more"); // Button to load more monsters

    let page = 1; // Tracks the current page for pagination

    // Function to fetch and display monsters
    function fetchMonsters(pageNumber = 1, limit = 50) {
        fetch(`http://localhost:3000/monsters?_limit=${limit}&_page=${pageNumber}`)
            .then(response => {
                if (!response.ok) throw new Error(`Error: ${response.status}`); // Error handling
                return response.json(); // Convert response to JSON
            })
            .then(monsters => {
                monsters.forEach(monster => displayMonster(monster)); // Loop through and display each monster
            })
            .catch(error => console.error("Error fetching monsters:", error)); // Catch and log errors
    }

    // Function to create and append a monster element to the DOM
    function displayMonster(monster) {
        const monsterDiv = document.createElement("div"); // Create a div for each monster
        monsterDiv.innerHTML = `
            <h3>${monster.name}</h3>
            <p>Age: ${monster.age}</p>
            <p>Description: ${monster.description}</p>
        `;
        monsterContainer.appendChild(monsterDiv); // Append the new monster to the page
    }

    // Function to handle new monster creation
    function createMonster(event) {
        event.preventDefault(); // Prevents page refresh on form submission

        // Get user input values
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const description = document.getElementById("description").value;

        // Ensure all fields are filled before proceeding
        if (!name || !age || !description) {
            alert("Please fill in all fields!");
            return;
        }

        // Create an object representing the new monster
        const newMonster = { name, age: parseFloat(age), description };

        // Send a POST request to create the new monster
        fetch("http://localhost:3000/monsters", {
            method: "POST", // Send data to the server
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(newMonster) // Convert object to JSON string
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error: ${response.status}`); // Handle errors
                return response.json(); // Convert response to JSON
            })
            .then(createdMonster => {
                displayMonster(createdMonster); // Display the new monster on the page
                createMonsterForm.reset(); // Clear the form after submission
            })
            .catch(error => console.error("Error creating monster:", error)); // Log errors
    }

    // Event listener for submitting the form (calls createMonster function)
    createMonsterForm.addEventListener("submit", createMonster);

    // Event listener for loading more monsters (calls fetchMonsters with next page)
    loadMoreButton.addEventListener("click", () => {
        page++; // Increase the page count
        fetchMonsters(page); // Fetch the next set of monsters
    });

    // Initial fetch of monsters when the page loads (loads first 50 monsters)
    fetchMonsters();
});
