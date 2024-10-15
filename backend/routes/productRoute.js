const express = require('express')
const Product = require('../models/products')
const { check, validationResult, ExpressValidator} = require('express-validator')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

const dotenv = require('dotenv');
dotenv.config();

const route=express.Router()

route.get('/',async(req,res,next)=>{
    const searchQuery = req.query.search || ''; // Extracting query parameter
    if(searchQuery!='')
    {
        let products;
        try {
            products = await Product.find({
            name: { $regex: searchQuery, $options: 'i' }
            });
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
        if(!products.length)
        {
            let products1
            try{
                products1 = await Product.find() 
            }
            catch(error){
                const err = new Error('Couldnot fetch products. Try again later!!!')
                err.code=500
                return next(err)
            }
            res.status(200).json({products : products1.map((u)=> u.toObject({ getters : true }) )})
        }
        else{
            res.json({products:products});  // Return filtered products
        }
    }
    else{
        let products;
    try{
        products = await Product.find() 
    }
    catch(error){
        const err = new Error('Couldnot fetch products. Try again later!!!')
        err.code=500
        return next(err)
    }
    res.status(200).json({products : products.map((u)=> u.toObject({ getters : true }) )})
    }
    
})

route.get('/:pid',async(req,res,next)=>{
    let product;
    try{
        product = await Product.findById(req.params.pid) 
    }
    catch(error){
        const err = new Error('Couldnot fetch product details. Try again later!!!')
        err.code=500
        return next(err)
    }
    if(!product)
    {
        const error = new Error('Product not found!')
        error.code=404
        return next(error)
    }
    res.status(200).json({product : product.toObject({ getters : true })})
})

route.use(checkAuth)

// add autherization for admin
route.use((req,res,next)=>{
    if(req.userData.userId===process.env.ADMIN_ID)
        next()
    else{
        const error=new Error('Not an admin')
        error.code=422
        return next(error)
    }
})

route.post('/',
    fileUpload.array('image',10), 
    [
        check('name').not().isEmpty(),
        check('price').not().isEmpty().isInt({ min: 1 }).withMessage('Not a price')
    ],
    async(req,res,next)=>{
        // extra lines of codee when using external validator
        const error = validationResult(req)
        if(!error.isEmpty())
        {
            console.log(error)
            const err=new Error('Please Check youur data')
            err.code=422
            return next(err)
        }
        //

        const {name,price,desc} = req.body
        if(req.files.length<1 || req.files.length>10 )
        {
            const err= new Error('Number of images should be between 1 to 10')
            err.code=422
            return next(RangeError)
        }
        const imagePaths = req.files.map(file => file.path);
        const newProduct = new Product({
            name,
            price,
            desc,
            image: imagePaths
        })
        try
        {
            await newProduct.save(newProduct)
        }
        catch(err){
            console.log(err)
            const error = new Error('Could not create a product')
            error.code=500
            return next(error)
        }
        res.status(200).json({"message":"Product Craeted Successfully",
            product: newProduct.toObject( { getters:true }) })
})

route.patch('/:pid',async(req,res,next)=>{
    const {price,desc,name} = req.body
    let product;
    try{
        product = await Product.findById(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    if(!product)
    {
        const error = new Error('Product not found!')
        error.code=404
        return next(error)
    }
    let updatedProduct
    try{
        await Product.findByIdAndUpdate(req.params.pid, {name,desc,price})
        updatedProduct = await Product.findById(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while editing')
        error.code=422
        return next(error)
    }
    res.json({message: "Product edited Successfully",product: updatedProduct})

})

route.delete('/:pid',async(req,res,next)=>{
    let product;
    try{
        product = await Product.findById(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while deleting')
        error.code=422
        return next(error)
    }
    if(!product)
    {
        const error = new Error('Product not found!')
        error.code=404
        return next(error)
    }
    try{
        await Product.findByIdAndDelete(req.params.pid)
    }
    catch(err)
    {
        const error = new Error('Some problem occurred while deleting')
        error.code=422
        return next(error)
    }
    res.json({message: "Product deleted Successfully"})
})

module.exports=route