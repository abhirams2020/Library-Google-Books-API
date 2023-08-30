document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsDiv = document.getElementById("results");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const currentPageSpan = document.getElementById("currentPage");
    const modal = document.getElementById("bookDetailsModal");
    const closeModal = document.querySelector(".close");
    const modalBookDetails = document.getElementById("modalBookDetails");
  
    let currentPage = 1;
    let searchResults = [];
  
    searchButton.addEventListener("click", () => {
      const searchTerm = searchInput.value.trim();
      if (searchTerm === "") {
        return;
      }
  
      fetchResults(searchTerm, currentPage);
    });
  
    function fetchResults(term, page) {
      const startIndex = (page - 1) * 10;
      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:${term}&startIndex=${startIndex}&maxResults=10`;
  
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          searchResults = data.items;
          displayResults(searchResults);
          updatePagination(data.totalItems, page);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }
  
    function updatePagination(totalResults, currentPage) {
      currentPageSpan.textContent = `Page ${currentPage}`;
  
      prevPageButton.disabled = currentPage === 1;
      nextPageButton.disabled = currentPage * 10 >= totalResults;
    }
  
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        const searchTerm = searchInput.value.trim();
        fetchResults(searchTerm, currentPage);
      }
    });
  
    nextPageButton.addEventListener("click", () => {
      currentPage++;
      const searchTerm = searchInput.value.trim();
      fetchResults(searchTerm, currentPage);
    });
  
    function displayResults(books) {
      resultsDiv.innerHTML = "";
  
      books.forEach((book, index) => {
        const title = book.volumeInfo.title;
        const authors = book.volumeInfo.authors
          ? book.volumeInfo.authors.join(", ")
          : "Unknown Author";
  
        const bookElement = document.createElement("div");
        bookElement.className = "book";
        bookElement.dataset.bookIndex = index;
        bookElement.innerHTML = `
          <h2>${title}</h2>
          <p>Author(s): ${authors}</p>
        `;
  
        resultsDiv.appendChild(bookElement);
      });
    }
  
    function displayBookDetails(book) {
      modalBookDetails.innerHTML = `
        <h2>${book.volumeInfo.title}</h2>
        <p>Author(s): ${
          book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown Author"
        }</p>
        <p>Publisher: ${book.volumeInfo.publisher}</p>
        <p>Published Date: ${book.volumeInfo.publishedDate}</p>
        <p>Description: ${
          book.volumeInfo.description || "No description available."
        }</p>
      `;
  
      modal.style.display = "block";
    }
  
    resultsDiv.addEventListener("click", event => {
      const bookIndex = event.target.dataset.bookIndex;
      if (bookIndex !== undefined) {
        const selectedBook = searchResults[bookIndex];
        displayBookDetails(selectedBook);
      }
    });
  
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", event => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });  