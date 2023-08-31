const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors package
require('dotenv').config(); // to encrypt username, password

const app = express();
const port = 3000;

app.use(cors()); // Use the cors middleware

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// app.get('/api/books', async (req, res) => {
//     try {
//     console.log(process.env.PG_HOST);
//     console.log(pool);
//       const client = await pool.connect();
//       const result = await client.query('SELECT * FROM books;');
//       const books = result.rows;
//       client.release();
//       res.json(books);
//     } catch (err) {
//       console.error('Error fetching data', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

  app.get('/api/books', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;   // Get the requested page, default to 1
      const itemsPerPage = parseInt(req.query.itemsPerPage) || 10; // Get items per page, default to 10
      const offset = (page - 1) * itemsPerPage;      // Calculate the offset
  
      const client = await pool.connect();
      const result = await client.query(`
        SELECT * FROM books
        ORDER BY id
        LIMIT ${itemsPerPage}
        OFFSET ${offset};
      `);
  
      const books = result.rows;
      client.release();
      res.json(books);
    } catch (err) {
      console.error('Error fetching data', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});