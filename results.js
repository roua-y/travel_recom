document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("query");

    const searchButton = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");
    const clearButton = document.getElementById("clear-btn");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Toggle Mobile Menu
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Handle Search
    if (searchButton && searchInput) {
        searchButton.addEventListener("click", performSearch);
        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") performSearch();
        });
    }

    // Handle Clear Button
    if (clearButton) {
        clearButton.addEventListener("click", clearResults);
    }

    // Fetch and display results if a keyword is present
    if (keyword) {
        fetchAndDisplayResults(keyword);
    } else {
        displayNoResults();
    }

    async function fetchAndDisplayResults(keyword) {
        try {
            const response = await fetch("travel_recom.json");
            const data = await response.json();
            const filteredResults = filterRecommendations(data, keyword);
            displayRecommendations(filteredResults);
        } catch (error) {
            console.error("Error fetching data:", error);
            displayNoResults();
        }
    }

    function filterRecommendations(data, keyword) {
        const results = {
            countries: [],
            temples: [],
            beaches: []
        };

        // Filter Countries and Cities
        if (data.countries && Array.isArray(data.countries)) {
            results.countries = data.countries.filter(country => {
                const matchedCities = country.cities.filter(city =>
                    city.name.toLowerCase().includes(keyword) ||
                    city.description.toLowerCase().includes(keyword)
                );
                return country.name.toLowerCase().includes(keyword) || matchedCities.length > 0;
            });
        }

        // Filter Temples and Beaches
        ["temples", "beaches"].forEach(category => {
            if (data[category] && Array.isArray(data[category])) {
                results[category] = data[category].filter(item =>
                    item.name.toLowerCase().includes(keyword) ||
                    item.description.toLowerCase().includes(keyword)
                );
            }
        });

        return results;
    }

    function displayRecommendations(filteredResults) {
        const container = document.getElementById("resultsContainer");
        if (!container) return;

        container.innerHTML = "";

        // Display Filtered Countries and Cities
        if (filteredResults.countries.length > 0) {
            filteredResults.countries.forEach(country => {
                const countryCard = document.createElement("div");
                countryCard.classList.add("recommendation-card");
                countryCard.innerHTML = `<h3>${country.name}</h3>`;
                container.appendChild(countryCard);

                country.cities.forEach(city => {
                    const cityCard = document.createElement("div");
                    cityCard.classList.add("recommendation-card");
                    const imageUrl = city.imageUrl || "images/default.jpg";
                    cityCard.innerHTML = `
                        <img src="${imageUrl}" alt="${city.name}" onerror="this.src='images/default.jpg'">
                        <h3>${city.name}</h3>
                        <p>${city.description}</p>
                        <button class="book-btn" onclick="bookDestination('${city.name}')">Book Now</button>
                    `;
                    container.appendChild(cityCard);
                });
            });
        }

        // Display Filtered Temples and Beaches
        ["temples", "beaches"].forEach(category => {
            if (filteredResults[category].length > 0) {
                filteredResults[category].forEach(item => {
                    const card = document.createElement("div");
                    card.classList.add("recommendation-card");
                    const imageUrl = item.imageUrl || "images/default.jpg";
                    card.innerHTML = `
                        <img src="${imageUrl}" alt="${item.name}" onerror="this.src='images/default.jpg'">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <button class="book-btn" onclick="bookDestination('${item.name}')">Book Now</button>
                    `;
                    container.appendChild(card);
                });
            }
        });

        // Show a message if no results are found
        if (container.innerHTML === "") {
            displayNoResults();
        }
    }

    function displayNoResults() {
        const container = document.getElementById("resultsContainer");
        if (container) {
            container.innerHTML = `<p class="no-results">No results found for your search.</p>`;
        }
    }

    function clearResults() {
        const container = document.getElementById("resultsContainer");
        if (container) {
            container.innerHTML = ""; // Clear the results container
        }
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.value = ""; // Clear the search input field
        }
    }

    function performSearch() {
        const keyword = searchInput.value.trim().toLowerCase();
        if (!keyword) {
            alert("Please enter a search term.");
            return;
        }

        // Redirect to the same page with the search keyword as a query parameter
        window.location.href = `travel_recom.html?query=${encodeURIComponent(keyword)}`;
    }
});