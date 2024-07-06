const axios = require('axios');
const { v4: uuidv4 } = require('uuid');


const API_BASE_URL = 'http://20.244.56.144/test';

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwMjQ4Mzc5LCJpYXQiOjE3MjAyNDgwNzksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZjMTVhMGRhLTY5M2EtNGU3Yi1hOWU5LTI0ZjZlMTU0ODI2ZCIsInN1YiI6ImNoYW5kcmFrYW50aGFocDIwMDJAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoibmV4cHJlc3MiLCJjbGllbnRJRCI6ImZjMTVhMGRhLTY5M2EtNGU3Yi1hOWU5LTI0ZjZlMTU0ODI2ZCIsImNsaWVudFNlY3JldCI6IkVIcmVGaXJrYm50YXBkYW8iLCJvd25lck5hbWUiOiJDaGFuZHJha2FudGhhSFAiLCJvd25lckVtYWlsIjoiY2hhbmRyYWthbnRoYWhwMjAwMkBnbWFpbC5jb20iLCJyb2xsTm8iOiI0VlYyMUlTMDI2In0.5tsa9WwVzUDTsL5v9dCmcTwO0-LJ23xCzG-_Kl4avWc'; // Replace with your actual access token


const generateUniqueId = () => {
    return uuidv4();
};


const fetchTopProducts = async (companyName, categoryName, n, minPrice, maxPrice, sortBy, order, page) => {
    if (!['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'].includes(companyName)) {
        throw new Error('Invalid company name');
    }

    const baseUrl = `${API_BASE_URL}/companies/${companyName}/categories/${categoryName}/products`;

    try {
        const response = await axios.get(baseUrl, {
            params: {
                top: n,
                minPrice: minPrice,
                maxPrice: maxPrice
            },
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        let products = response.data;

        
        products.forEach(product => {
            product.id = generateUniqueId(); 
            product.company = companyName; 
        });

        

        return products; 

    } catch (error) {
        console.error(`Error fetching products from ${companyName}:`, error.message);
        throw error;
    }
};


const fetchProductDetails = async (companyName, categoryName, productId) => {
    if (!['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'].includes(companyName)) {
        throw new Error('Invalid company name');
    }

    const baseUrl = `${API_BASE_URL}/companies/${companyName}/categories/${categoryName}/products/top-100`;

    try {
        const response = await axios.get(baseUrl, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        const products = response.data;
        const product = products.find(p => p.id === productId);
        
        if (product) {
            product.company = companyName; 
            return product;
        } else {
            throw new Error('Product not found');
        }

    } catch (error) {
        console.error(`Error fetching product details from ${companyName}:`, error.message);
        throw error;
    }
};

module.exports = { fetchTopProducts, fetchProductDetails };
