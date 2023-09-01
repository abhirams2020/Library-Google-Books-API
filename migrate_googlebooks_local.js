// Script to get first 1000 english books from googlebooks api.
const axios = require("axios");
const { Pool } = require("pg");
require("dotenv").config(); // to encrypt username, password

const pool = new Pool({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
});

function isValidDateFormat(dateString) {
	const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
	return dateFormat.test(dateString);
}

async function fetchAndInsertBooks() {
	try {
		// Fetch data from the API (replace with the actual API endpoint)
		const maxResults = 40; // Number of results per request
		const totalBooks = 1000; // Total number of books you want to fetch
		const numRequests = Math.ceil(totalBooks / maxResults); // Calculate the number of requests needed

		let books = [];

		for (let i = 0; i < numRequests; i++) {
			console.log(`request ${numRequests}`);
			const startIndex = i * maxResults;
			const response = await axios.get(
				`https://www.googleapis.com/books/v1/volumes?q=language:en&maxResults=${maxResults}&startIndex=${startIndex}`
			);
			console.log(
				`https://www.googleapis.com/books/v1/volumes?q=language:en&maxResults=${maxResults}&startIndex=${startIndex}`
			);
			const curr = response.data.items || [];

			books.push(...curr);

			if (i < numRequests - 1) {
				// Add a delay between requests. Increment delay by 500ms each time
				await new Promise((resolve) =>
					setTimeout(resolve, 500 + 500 * i)
				);
			}
		}

		// Transform and insert data
		const client = await pool.connect();

		// Drop the existing books table if it exists
		await client.query("DROP TABLE IF EXISTS books;");

		// Create the books table
		await client.query(
			"CREATE TABLE books (id SERIAL PRIMARY KEY, title TEXT NOT NULL, author TEXT, publisher TEXT, published_date DATE, description TEXT);"
		);

		for (const book of books) {
			const { title, authors, publisher, publishedDate, description } =
				book.volumeInfo;

			// Set default values for missing fields
			const sanitizedPublisher = publisher || "Unknown Publisher";

			// Insert the data into the books table
			// Check if the title is present and not null
			if (title) {
				// Insert data into the books table
				await client.query(
					"INSERT INTO books (title, author, publisher, published_date, description) VALUES ($1, $2, $3, $4, $5)",
					[
						title,
						authors ? authors.join(", ") : null,
						publisher || null,
						isValidDateFormat(publishedDate) ? publishedDate:'1900-01-01',
						description || null,
					]
				);
			} else {
				console.log("Skipping book with missing title:", book);
			}
		}

		client.release();
		console.log("Data insertion completed.");
	} catch (error) {
		console.error("Error:", error);
	} finally {
		pool.end();
	}
}

fetchAndInsertBooks();
