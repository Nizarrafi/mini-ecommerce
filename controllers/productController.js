const Product = require("../models/Product");
const AWS = require("aws-sdk");

// S3 Configuration
// S3 Configuration (Use IAM Instance Profile if keys are missing)
const s3 = new AWS.S3({
    region: process.env.AWS_REGION
});

const productController = {
    getAll: async (req, res) => {
        try {
            const products = await Product.getAll();
            res.render("index", { products });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    getAddPage: (req, res) => {
        res.render("add-product");
    },

    create: async (req, res) => {
        try {
            const { name, price } = req.body;
            let image_url = null;

            if (req.file) {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `products/${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };

                try {
                    const uploadResult = await s3.upload(params).promise();
                    image_url = uploadResult.Location;
                } catch (s3Err) {
                    console.error("S3 Upload Error:", s3Err);
                }
            }

            await Product.create(name, price, image_url);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error creating product");
        }
    },

    getEditPage: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.getById(id);
            if (!product) return res.status(404).send("Product not found");
            res.render("edit-product", { product });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price } = req.body;

            // Get existing product to retrieve old image if no new one is uploaded
            const existingProduct = await Product.getById(id);
            if (!existingProduct) return res.status(404).send("Product not found");

            let image_url = existingProduct.image_url;

            if (req.file) {
                const params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `products/${Date.now()}_${req.file.originalname}`,
                    Body: req.file.buffer,
                    ContentType: req.file.mimetype
                };

                try {
                    const uploadResult = await s3.upload(params).promise();
                    image_url = uploadResult.Location;
                } catch (s3Err) {
                    console.error("S3 Upload Error:", s3Err);
                }
            }

            await Product.update(id, name, price, image_url);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating product");
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            // 1. Get product to find the S3 image key
            const product = await Product.getById(id);
            if (product && product.image_url) {
                try {
                    const url = new URL(product.image_url);
                    // Standard S3 URL: https://bucket.s3.region.amazonaws.com/key
                    // Path: /key (leading slash should be removed)
                    const key = decodeURIComponent(url.pathname.substring(1));

                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: key
                    };

                    await s3.deleteObject(params).promise();
                    console.log("S3 Image Deleted:", key);
                } catch (s3Err) {
                    console.error("Error deleting from S3:", s3Err.message);
                }
            }

            // 2. Delete from Database
            await Product.delete(id);
            res.redirect("/");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting product");
        }
    },
};

module.exports = productController;
