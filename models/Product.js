const pool = require("../config/db");

const Product = {
    getAll: async () => {
        const res = await pool.query("SELECT * FROM products ORDER BY id DESC");
        return res.rows;
    },
    getById: async (id) => {
        const res = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        return res.rows[0];
    },
    create: async (name, price, image_url) => {
        const res = await pool.query(
            "INSERT INTO products (name, price, image_url) VALUES ($1, $2, $3) RETURNING *",
            [name, price, image_url]
        );
        return res.rows[0];
    },
    update: async (id, name, price, image_url) => {
        const res = await pool.query(
            "UPDATE products SET name=$1, price=$2, image_url=$3 WHERE id=$4 RETURNING *",
            [name, price, image_url, id]
        );
        return res.rows[0];
    },
    delete: async (id) => {
        await pool.query("DELETE FROM products WHERE id = $1", [id]);
    },
};

module.exports = Product;
