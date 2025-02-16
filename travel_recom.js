document.addEventListener("DOMContentLoaded", async function () {
    const data = await fetchRecommendations();
    console.log("Initial Data Load:", data); // ✅ Debugging
});

// Fetch data from JSON file
async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log("Fetched Data:", JSON.stringify(data, null, 2)); // ✅ Debug entire JSON
        return data; 
    } catch (error) {
        console.error('Error fetching data:', error);
        return {};
    }
}

// Search functionality
document.getElementById("searchButton").addEventListener("click", async () => {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    const data = await fetchRecommendations();

    if (!data || Object.keys(data).length === 0) {
        console.error("No data found.");
        return;
    }

    let results = [];

    if (searchTerm.includes("beach") || searchTerm.includes("beaches")) {
        results = data.beaches || [];
    } else if (searchTerm.includes("temple") || searchTerm.includes("temples")) {
        results = data.temples || [];
    } else if (searchTerm.includes("country") || searchTerm.includes("countries")) {
        results = data.countries?.flatMap(country => country.cities) || [];
    }

    console.log("Filtered results:", results); // ✅ Debugging
    displayRecommendations(results);
});

// Display recommendations on the page
function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = recommendations.length ? "" : "<p>No results found.</p>";

    recommendations.forEach(item => {
        const card = document.createElement("div");
        card.className = "recommendation-item";
        card.innerHTML = `
            <div class="card">
                <h3>${item.name || "Unknown"}</h3>
                <img src="${item.imageUrl || "placeholder.jpg"}" alt="${item.name || "No Image"}">
                <p>${item.description || "No description available."}</p>
            </div>
        `;
        resultsContainer.appendChild(card);
    });

    console.log("Displayed results:", recommendations); // ✅ Debugging
}
