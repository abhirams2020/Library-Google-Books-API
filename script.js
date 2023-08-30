document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsDiv = document.getElementById("results");
  const modal = document.getElementById("bookDetailsModal");
  const closeModal = document.querySelector(".close");
  const modalBookDetails = document.getElementById("modalBookDetails");

  let searchResults = [];

  function fetchResults(term, page) {
    const startIndex = (page - 1) * 10;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${term}&lang=en&startIndex=${startIndex}&maxResults=10`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        searchResults = data.items || [];
        displayResults(searchResults);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }

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
        <button class="view-details">View Details</button>
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
    if (event.target.classList.contains("view-details")) {
      const bookIndex = event.target.closest(".book").dataset.bookIndex;
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

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      fetchResults(searchTerm, 1);
    }
  });

  fetchResults('programming', 1);
});
