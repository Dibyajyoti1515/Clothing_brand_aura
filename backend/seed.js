require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
    // ─── MEN ─────────────────────────────────────────────────────────────────
    {
        name: 'Linen Oversized Shirt',
        description: 'Breathable 100% linen shirt with a relaxed oversized fit. Perfect for warm days, featuring a classic collar and a subtle earth-tone palette that pairs effortlessly with everything.',
        price: 2499,
        category: 'Men',
        subCategory: 'Shirts',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stockQuantity: 80,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', altText: 'Linen Oversized Shirt Front' },
            { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4ef8?w=600&q=80', altText: 'Linen Oversized Shirt Back' },
        ],
    },
    {
        name: 'Slim Fit Chino Trousers',
        description: 'Tailored slim-fit chinos crafted from a cotton-stretch blend. These versatile trousers transition seamlessly from office to evening with their clean lines and minimal design.',
        price: 3299,
        category: 'Men',
        subCategory: 'Trousers',
        sizes: ['S', 'M', 'L', 'XL'],
        stockQuantity: 60,
        discount: 10,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80', altText: 'Slim Fit Chinos' },
        ],
    },
    {
        name: 'Raw Hem Denim Jacket',
        description: 'A modern take on the classic denim jacket. Features raw hem detailing, slightly distressed finishing, and a boxy silhouette that looks equally good over a tee or a shirt.',
        price: 4999,
        category: 'Men',
        subCategory: 'Jackets',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stockQuantity: 45,
        discount: 15,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&q=80', altText: 'Raw Hem Denim Jacket' },
            { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', altText: 'Denim Jacket Detail' },
        ],
    },
    {
        name: 'Essential Crew Neck Tee',
        description: 'The perfect everyday t-shirt. Made from 220gsm combed cotton for a substantial feel that doesn\'t lose shape after washing. Available in 6 carefully chosen neutral colours.',
        price: 999,
        category: 'Men',
        subCategory: 'T-Shirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        stockQuantity: 200,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', altText: 'Essential Crew Neck Tee' },
        ],
    },
    {
        name: 'Textured Knit Polo',
        description: 'A refined polo shirt with subtle textured knit fabric. The ribbed collar and cuffs add structure, making this a step above the ordinary polo while keeping things effortlessly casual.',
        price: 1899,
        category: 'Men',
        subCategory: 'Polo',
        sizes: ['S', 'M', 'L', 'XL'],
        stockQuantity: 70,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80', altText: 'Textured Knit Polo' },
        ],
    },
    {
        name: 'Cargo Utility Pants',
        description: 'Functional cargo pants with a modern slim silhouette. Features six pockets, adjustable ankle tabs, and a durable ripstop fabric that looks clean without feeling military.',
        price: 3799,
        category: 'Men',
        subCategory: 'Trousers',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stockQuantity: 55,
        discount: 20,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', altText: 'Cargo Utility Pants' },
        ],
    },

    // ─── WOMEN ───────────────────────────────────────────────────────────────
    {
        name: 'Flowy Maxi Dress',
        description: 'An effortlessly elegant maxi dress in a lightweight georgette fabric. The wrap-style bodice and tiered skirt create a flattering silhouette for any occasion from beach to brunch.',
        price: 3999,
        category: 'Women',
        subCategory: 'Dresses',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stockQuantity: 50,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80', altText: 'Flowy Maxi Dress' },
            { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', altText: 'Maxi Dress Side View' },
        ],
    },
    {
        name: 'Structured Blazer',
        description: 'A perfectly structured blazer that transitions from boardroom to weekend effortlessly. Tailored from a premium wool-blend fabric with a single-button closure and clean lapels.',
        price: 5499,
        category: 'Women',
        subCategory: 'Blazers',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 35,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80', altText: 'Structured Blazer' },
        ],
    },
    {
        name: 'High-Rise Wide Leg Jeans',
        description: 'Vintage-inspired high-rise jeans with a wide-leg cut that elongates the silhouette. Made from selvedge denim with just the right amount of stretch for all-day comfort.',
        price: 4299,
        category: 'Women',
        subCategory: 'Jeans',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stockQuantity: 65,
        discount: 10,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80', altText: 'High-Rise Wide Leg Jeans' },
        ],
    },
    {
        name: 'Ribbed Knit Co-ord Set',
        description: 'A matching ribbed knit crop top and midi skirt set. The neutral sage tone and fitted silhouette make this an instant outfit — wear together or style as separates.',
        price: 3199,
        category: 'Women',
        subCategory: 'Co-ords',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 40,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', altText: 'Ribbed Knit Co-ord Set' },
        ],
    },
    {
        name: 'Cotton Poplin Kurta',
        description: 'A contemporary take on the classic kurta. Made from soft cotton poplin with subtle pintuck detailing at the front. Designed to be worn with palazzos or straight pants.',
        price: 1799,
        category: 'Women',
        subCategory: 'Ethnic',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stockQuantity: 90,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', altText: 'Cotton Poplin Kurta' },
        ],
    },
    {
        name: 'Satin Slip Midi Skirt',
        description: 'A luxe satin slip skirt with a bias-cut hem that moves beautifully. An elastic waistband ensures comfort while the satin sheen adds instant elegance to any top.',
        price: 2799,
        category: 'Women',
        subCategory: 'Skirts',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 45,
        discount: 15,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80', altText: 'Satin Slip Midi Skirt' },
        ],
    },

    // ─── KIDS ────────────────────────────────────────────────────────────────
    {
        name: 'Striped Cotton Playsuit',
        description: 'A cheerful striped playsuit made from 100% soft organic cotton. Features snap buttons for easy dressing and roomy proportions that let little ones move freely.',
        price: 1299,
        category: 'Kids',
        subCategory: 'Playsuits',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 100,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80', altText: 'Striped Cotton Playsuit' },
        ],
    },
    {
        name: 'Fleece Hoodie',
        description: 'Super-soft fleece hoodie in a range of fun colours. Features a kangaroo pocket and adjustable drawstring. Machine washable and durable enough for the most adventurous kids.',
        price: 1599,
        category: 'Kids',
        subCategory: 'Sweatshirts',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 120,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80', altText: 'Kids Fleece Hoodie' },
        ],
    },
    {
        name: 'Organic Denim Shorts',
        description: 'Classic denim shorts made from certified organic cotton. The mid-rise fit and rolled cuffs are both practical and stylish for active kids all summer long.',
        price: 999,
        category: 'Kids',
        subCategory: 'Shorts',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 85,
        discount: 10,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80', altText: 'Organic Denim Shorts' },
        ],
    },
    {
        name: 'Dinosaur Print Pyjama Set',
        description: 'Adorable dinosaur-print pyjama set in cosy brushed cotton. The elastic waistband bottoms and button-through top make bedtime routine a breeze.',
        price: 1199,
        category: 'Kids',
        subCategory: 'Nightwear',
        sizes: ['XS', 'S', 'M', 'L'],
        stockQuantity: 75,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', altText: 'Dinosaur Pyjama Set' },
        ],
    },

    // ─── ACCESSORIES ─────────────────────────────────────────────────────────
    {
        name: 'Woven Leather Belt',
        description: 'Handwoven genuine leather belt with a subtle braided pattern. The brushed nickel buckle adds a refined touch. Available in tan and dark brown. Width: 3.5cm.',
        price: 1499,
        category: 'Accessories',
        subCategory: 'Belts',
        sizes: ['Free Size'],
        stockQuantity: 60,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', altText: 'Woven Leather Belt' },
        ],
    },
    {
        name: 'Merino Wool Beanie',
        description: 'Buttery-soft merino wool beanie with a double-layered cuff for extra warmth. Minimal and versatile — pairs with everything from puffer jackets to overcoats.',
        price: 899,
        category: 'Accessories',
        subCategory: 'Hats',
        sizes: ['Free Size'],
        stockQuantity: 110,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80', altText: 'Merino Wool Beanie' },
        ],
    },
    {
        name: 'Canvas Tote Bag',
        description: 'A minimalist heavy-duty canvas tote with a 15-litre capacity. Features an interior zip pocket and reinforced handles that can carry up to 15kg. Ethically made.',
        price: 1199,
        category: 'Accessories',
        subCategory: 'Bags',
        sizes: ['Free Size'],
        stockQuantity: 90,
        discount: 20,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', altText: 'Canvas Tote Bag' },
        ],
    },
    {
        name: 'Cashmere Blend Scarf',
        description: 'Luxuriously soft cashmere-blend scarf with a classic herringbone weave. Generously sized at 180cm × 70cm to be worn as a wrap, shawl, or traditional scarf.',
        price: 2199,
        category: 'Accessories',
        subCategory: 'Scarves',
        sizes: ['Free Size'],
        stockQuantity: 40,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', altText: 'Cashmere Blend Scarf' },
        ],
    },

    // ─── FOOTWEAR ─────────────────────────────────────────────────────────────
    {
        name: 'Suede Chelsea Boots',
        description: 'Classic Chelsea boots in premium suede leather with elastic side panels and a stacked rubber sole. The slightly pointed toe adds a modern touch to a timeless silhouette.',
        price: 6999,
        category: 'Footwear',
        subCategory: 'Boots',
        sizes: ['S', 'M', 'L', 'XL'],
        stockQuantity: 30,
        discount: 0,
        isFeatured: true,
        images: [
            { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', altText: 'Suede Chelsea Boots' },
        ],
    },
    {
        name: 'Slip-On Canvas Sneakers',
        description: 'Effortless canvas slip-ons with a vulcanised rubber sole. Inspired by workwear aesthetics — clean, flat, and built for all-day comfort. Available in three colourways.',
        price: 2499,
        category: 'Footwear',
        subCategory: 'Sneakers',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        stockQuantity: 80,
        discount: 0,
        isFeatured: false,
        images: [
            { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80', altText: 'Canvas Slip-On Sneakers' },
        ],
    },
];

const seed = async () => {
    await connectDB();

    try {
        // Clear existing products
        const existing = await Product.countDocuments();
        if (existing > 0) {
            console.log(`⚠️  Found ${existing} existing products. Deleting them first...`);
            await Product.deleteMany({});
            console.log('🗑️  Cleared existing products.');
        }

        // Insert seed data
        const inserted = await Product.insertMany(products);
        console.log(`\n✅ Successfully seeded ${inserted.length} products:\n`);

        // Summary table
        const categories = [...new Set(products.map(p => p.category))];
        for (const cat of categories) {
            const count = products.filter(p => p.category === cat).length;
            console.log(`   ${cat.padEnd(15)} ${count} products`);
        }

        console.log('\n🚀 Your store is ready! Run `npm run dev` and start shopping.\n');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seed();