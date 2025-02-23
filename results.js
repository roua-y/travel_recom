// Function to handle the search button click
function handleSearch() {
    const searchInput = document.getElementById("search-input").value;
    if (searchInput) {
      // Redirect to the results page with the query parameter
      window.location.href = `results.html?query=${encodeURIComponent(searchInput)}`;
    } else {
      // If no input, redirect to the results page without a query parameter
      window.location.href = "results.html";
    }
  }
  
  // Function to handle the clear button click
  function handleClear() {
    // Clear the search input and redirect to the results page without a query parameter
    document.getElementById("search-input").value = "";
    window.location.href = "results.html";
  }
  
  // Add event listeners for the search and clear buttons
  document.getElementById("search-button").addEventListener("click", handleSearch);
  document.getElementById("clear-button").addEventListener("click", handleClear);
  
  // Add event listener for the Enter key
  document.getElementById("search-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleSearch(); // Trigger the search function
    }
  });
  
  // Function to normalize the query and handle variations
  function normalizeQuery(query) {
    if (!query) return "";
  
    // Convert to lowercase and trim whitespace
    const cleanQuery = query.trim().toLowerCase();
  
    // Handle variations of keywords
    if (cleanQuery.includes("beach") || cleanQuery.includes("beaches")) {
      return "beach";
    } else if (cleanQuery.includes("temple") || cleanQuery.includes("temples")) {
      return "temple";
    } else if (cleanQuery.includes("country") || cleanQuery.includes("countries")) {
      return "country";
    } else {
      return cleanQuery; // Return the original query if no match
    }
  }
  
  // Function to filter data based on the normalized query
  function filterData(data, query) {
    if (!query) {
      return []; // Return empty array if no query is provided
    }
  
    const normalizedQuery = normalizeQuery(query);
  
    if (normalizedQuery === "beach") {
      return data.beaches; // Return beaches data
    } else if (normalizedQuery === "temple") {
      return data.temples; // Return temples data
    } else if (normalizedQuery === "country") {
      return data.countries.flatMap(country => country.cities); // Return cities data
    } else {
      // Fallback: Filter by name if no keyword match
      return data.countries.flatMap(country => country.cities)
        .concat(data.temples)
        .concat(data.beaches)
        .filter(item => item.name.toLowerCase().includes(normalizedQuery));
    }
  }
  
  // Function to display search results
  function displayResults(results) {
    const container = document.getElementById("results-container");
    if (!container) {
      console.error("Results container not found!");
      return;
    }
    container.innerHTML = ""; // Clear previous results
  
    if (results.length > 0) {
      results.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("result");
  
        // Create image element
        const image = document.createElement("img");
        image.src = item.imageUrl;
        image.alt = item.name;
        image.classList.add("result-image"); // Add a class for styling
  
        // Create name element
        const name = document.createElement("h3");
        name.textContent = item.name;
  
        // Create description element
        const description = document.createElement("p");
        description.textContent = item.description;
  
        // Create "Book Now" button
        const bookNowButton = document.createElement("button");
        bookNowButton.textContent = "Book Now";
        bookNowButton.classList.add("book-now-button"); // Add a class for styling
  
        // Append elements to the result container
        itemElement.appendChild(image);
        itemElement.appendChild(name);
        itemElement.appendChild(description);
        itemElement.appendChild(bookNowButton);
  
        // Append the result to the main container
        container.appendChild(itemElement);
      });
    } else {
      container.innerHTML = "<p>No results found for your search.</p>";
    }
  }
  
  // Fetch the data from the JSON file and display the results based on the query
  async function loadDataAndDisplayResults() {
    try {
      const response = await fetch("travel_recom.json");
      const data = await response.json();
  
      // Retrieve the query parameter from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("query");
  
      // Filter the data based on the query (if provided)
      const filteredResults = query ? filterData(data, query) : [];
  
      // Debug: Log filtered results
      console.log("Filtered Results:", filteredResults);
  
      // Display the filtered data
      displayResults(filteredResults);
  
    } catch (error) {
      console.error("Error fetching the data:", error);
    }
  }
  
  // Load the data and display results when the page loads
  window.onload = loadDataAndDisplayResults;