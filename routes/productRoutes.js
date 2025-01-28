import { Router } from 'express';
import Product from '../models/Product.js';
const productRoutes = Router();

// GET route to fetch all products with search functionality
productRoutes.get('/', async (req, res) => {
    try {
        const { search } = req.query;
      
        // Sanitize search input to prevent regex injection
        const escapeRegex = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const sanitizedSearch = search ? escapeRegex(search) : null;
  
        // Build the search query only if there's a valid search term
        const query = sanitizedSearch ?
            {
                $or: [
                    { name: { $regex: sanitizedSearch, $options: 'i' } },
                    { description: { $regex: sanitizedSearch, $options: 'i' } },
                    { category: { $regex: sanitizedSearch, $options: 'i' } },
                    { manufacturer: { $regex: sanitizedSearch, $options: 'i' } }
            	]
          	}
        : {};
  
      	const products = await Product.find(query);
      	res.json(products);
    } catch (err) {
      	res.status(500).json({ message: err.message });
    }
});
  

// GET route to fetch a single product by ID
productRoutes.get('/:id', async (req, res) => {
  	try {
    	const product = await Product.findById(req.params.id);
    	if (!product) {
      		return res.status(404).json({ message: 'Product not found' });
    	}
    	res.json(product);
  	} catch (err) {
    	res.status(500).json({ message: err.message });
  	}
});

// POST route to add a new product
// is this route duplicate ?
// productRoutes.post('/', verifyToken, async (req, res) => {
//   	const product = new Product(req.body);
//   	try {
//     	await product.save();
//     	res.status(201).json(product);
//   	} catch (err) {
//     	res.status(400).json({ message: err.message });
//   	}
// });

export default productRoutes;