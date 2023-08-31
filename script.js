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

  let searchResults = [];
  let currentPage = 1; // Initialize with page 1
  const itemsPerPage = 10; // Number of items to show per page

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
      return;
    }
    fetchResults(searchTerm, currentPage);
  });

  function fetchResults(term, page) {
    const startIndex = (page - 1) * 10;
    console.log(page, startIndex, itemsPerPage)
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
    const apiUrl = `http://localhost:3000/api/books?page=${page}&itemsPerPage=${itemsPerPage}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        searchResults = data;
        displayResults(searchResults);
        updatePagination(data.totalItems, page);
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

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  resultsDiv.addEventListener("click", (event) => {
    if (event.target.classList.contains("view-details")) {
      const bookIndex = event.target.closest(".book").dataset.bookIndex;
      const selectedBook = searchResults[bookIndex];
      displayBookDetails(selectedBook);
    }
  });

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

  fetchResults('programming', currentPage);
});
