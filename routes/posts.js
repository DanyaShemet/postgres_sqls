
import {db} from "../db.js";
import express from "express";

const router = express.Router()

router.get('/posts', async (req, res) => {
    const result = await db.query(`
    SELECT posts.id, posts.title, users.name AS author_name
    FROM posts
    JOIN users ON posts.user_id = users.id
  `)



    res.json(result.rows)
})

router.post('/posts', async (req, res) => {
    const { title, userId } = req.body

    const result = await db.query(
        `
    INSERT INTO posts (title, user_id)
    VALUES ($1, $2)
    RETURNING *
    `,
        [title, userId]
    )

    res.status(201).json(result.rows[0])
})

router.post('/posts_with_comment', async (req, res) => {
    const { title, userId, comment } = req.body

    if (!title || !comment) {
        return res.status(400).json({ message: 'Validation' })
    }

    const user = await db.query(
        `SELECT * FROM users WHERE id = $1`,
        [userId]
    )

    if (!user.rows.length) {
        return res.status(400).json({ message: 'USer not found' })
    }

    const client = await db.connect()

    try {
        await client.query('BEGIN')

        const postResult = await client.query(
            `INSERT INTO posts (title, user_id)
            VALUES ($1, $2)
            RETURNING id`,
            [title, userId]
        )

        const postId = postResult.rows[0].id

        await client.query(
            `INSERT INTO comments (text, post_id)
            VALUES ($1, $2)`,
            [comment, postId]
        )

        await client.query('COMMIT')

        res.json({ message: 'Success' })

    } catch (err) {
        await client.query('ROLLBACK')
        res.status(500).json({ error: 'Something failed' })
    } finally {
        client.release()
    }
})

router.patch('/posts/:id', async (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const result = await db.query(
        `
    UPDATE posts
    SET title = $1
    WHERE id = $2
    RETURNING *
    `,
        [title, id]
    )

    if (!result.rows.length) {
        return res.status(404).json({ message: 'Post not found' })
    }

    res.json(result.rows[0])
})

router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params

    const result = await db.query(
        `
    DELETE FROM posts
    WHERE id = $1
    RETURNING *
    `,
        [id]
    )

    if (!result.rows.length) {
        return res.status(404).json({ message: 'Post not found' })
    }

    res.json({
        message: 'Post deleted',
        post: result.rows[0],
    })
})

router.get(`/posts/:id`, async (req, res) => {
    const id = req.params.id;

    const result = await db.query(
     `SELECT * FROM posts WHERE id = $1`,
        [id]
    )



    console.log(result)

    res.json(result.rows)
})

export default router