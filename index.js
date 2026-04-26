
import express from 'express'
import posts from "./routes/posts.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(posts)

app.get('/', (req, res) => {
  res.send('Express app is running');
});


app.get('/health', (req, res) => {
  console.log('data')
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
