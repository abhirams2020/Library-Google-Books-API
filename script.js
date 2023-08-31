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
    // const apiUrl1 = `https://www.googleapis.com/books/v1/volumes?q=intitle:${term}&langRestrict=en&startIndex=${startIndex}&maxResults=10`;
    // fetch(apiUrl1)
    //   .then(response => response.json())
    //   .then(data => {
    //     searchResults = data.items || [];
    //     console.log(searchResults);
    //     console.log(data);
    //     console.log(data.items);
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data:", error);
    //   });
    // return;
    const apiUrl = "http://localhost:3000/api/books";
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        searchResults = data;
        displayResults(searchResults);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function displayResults(books) {
    console.log('display results fn');
    resultsDiv.innerHTML = "";

    console.log(books);

    books.forEach((book, index) => {
      const title = book.title;
      const authors = book.author || "Unknown Author";

      const bookElement = document.createElement("div");
      bookElement.className = "book";
      bookElement.dataset.bookIndex = index; // dataset used to store custom attributes for element
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
      <h2>${book.title}</h2>
      <p>Author(s): ${
        book.author || "Unknown Author"
      }</p>
      <p>Publisher: ${book.publisher}</p>
      <p>Published Date: ${book.published_date}</p>
      <p>Description: ${
        book.description || "No description available."
      }</p>
    `;

    modal.style.display = "block";
  }

  resultsDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-details")) {
      const bookIndex = event.target.closest(".book").dataset.bookIndex;
      const selectedBook = searchResults[bookIndex];
      displayBookDetails(selectedBook);
    }
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
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
