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
		const apiUrl = `http://localhost:3000/api/books?intitle=${term}&page=${page}&itemsPerPage=${itemsPerPage}`;
		fetch(apiUrl)
			.then((response) => response.json())
			.then((data) => {
				searchResults = data;
				displayResults(searchResults);
        console.log(data.totalItems, page)
				updatePagination(page, searchResults.length);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}

	function displayResults(books) {
		resultsDiv.innerHTML = "";

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
      <p>Author(s): ${book.author || "Unknown Author"}</p>
      <p>Publisher: ${book.publisher}</p>
      <p>Published Date: ${book.published_date}</p>
      <p>Description: ${book.description || "No description available."}</p>
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

  function updatePagination(currentPage, resultsLength) {
    currentPageSpan.textContent = `Page ${currentPage}`;
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = resultsLength < itemsPerPage; // Disable if there are fewer results than itemsPerPage
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
    // shows all results if search term is ""
    fetchResults(searchTerm, 1);
		// if (searchTerm !== "") {
		//   fetchResults(searchTerm, 1);
		// }
	});

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission or other default behavior
      const searchTerm = searchInput.value.trim();
      if (searchTerm !== "") {
        fetchResults(searchTerm, 1);
      }
    }
  });

  searchInput.value = 'programming'; // give default search as programming. can change it later.
	fetchResults("programming", currentPage);
});
