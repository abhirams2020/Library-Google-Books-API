document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsDiv = document.getElementById("results");
  
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm === "") {
        return;
      }
  
      fetch(`https://openlibrary.org/search.json?q=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          displayResults(data.docs);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    });
  
    function displayResults(books) {
      resultsDiv.innerHTML = "";
  
      books.forEach(book => {
        const title = book.title;
        const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
  
        const bookElement = document.createElement("div");
        bookElement.className = "book";
        bookElement.innerHTML = `
          <h2>${title}</h2>
          <p>Author: ${author}</p>
        `;
  
        resultsDiv.appendChild(bookElement);
      });
    }
  });  