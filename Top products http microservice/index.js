const express = require('express');
const { Cache } = require('./cache');
const { fetchTopProducts, fetchProductDetails } = require('./services');


const app = express();
const cache = new Cache();

app.get('/categories/:categoryName/products', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        let n = parseInt(req.query.n) || 10;
        if (n > 10) n = 10;  
        const page = parseInt(req.query.page) || 1;
        const sortBy = req.query.sort_by || null;
        const order = req.query.order || 'asc';
        
        const cacheKey = `${categoryName}-${n}-${page}-${sortBy}-${order}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            return res.json(cachedResult);
        }

        const products = await fetchTopProducts(categoryName, n, page, sortBy, order);
        cache.set(cacheKey, products);
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const productId = req.params.productId;
        const product = await fetchProductDetails(categoryName, productId);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
