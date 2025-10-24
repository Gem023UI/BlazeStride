require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./models'); // Adjust path to your models file

// Sample product data
const products = [
  {
    productname: 'Nike Air Zoom Pegasus 40',
    description: 'Responsive cushioning for everyday running with updated mesh upper for breathability',
    category: ['daily', 'tempo'],
    brand: 'nike',
    price: 130,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/pegasus-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/pegasus-2.jpg',
      'https://res.cloudinary.com/demo/image/upload/pegasus-3.jpg'
    ]
  },
  {
    productname: 'Adidas Adizero Adios Pro 3',
    description: 'Carbon-plated racing shoe designed for marathon performance',
    category: ['marathon', 'race'],
    brand: 'adidas',
    price: 250,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/adios-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/adios-2.jpg'
    ]
  },
  {
    productname: 'ASICS Gel-Nimbus 25',
    description: 'Maximum cushioning for long-distance comfort and support',
    category: ['daily', 'marathon'],
    brand: 'asics',
    price: 160,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/nimbus-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/nimbus-2.jpg',
      'https://res.cloudinary.com/demo/image/upload/nimbus-3.jpg'
    ]
  },
  {
    productname: 'New Balance FuelCell SuperComp Elite v3',
    description: 'Elite racing shoe with dual-plate system for explosive speed',
    category: ['race'],
    brand: 'new balance',
    price: 275,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/fuelcell-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/fuelcell-2.jpg'
    ]
  },
  {
    productname: 'Brooks Ghost 15',
    description: 'Reliable everyday trainer with smooth transitions and soft cushioning',
    category: ['daily'],
    brand: 'brooks',
    price: 140,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/ghost-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/ghost-2.jpg'
    ]
  },
  {
    productname: 'Saucony Endorphin Speed 3',
    description: 'Versatile tempo shoe with nylon plate for speed training',
    category: ['tempo', 'race'],
    brand: 'saucony',
    price: 170,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/endorphin-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/endorphin-2.jpg',
      'https://res.cloudinary.com/demo/image/upload/endorphin-3.jpg'
    ]
  },
  {
    productname: 'Hoka Clifton 9',
    description: 'Lightweight daily trainer with plush cushioning and smooth ride',
    category: ['daily'],
    brand: 'hoka',
    price: 145,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/clifton-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/clifton-2.jpg'
    ]
  },
  {
    productname: 'Nike Vaporfly 3',
    description: 'Premium carbon-plated racer for marathon and road racing',
    category: ['marathon', 'race'],
    brand: 'nike',
    price: 260,
    productimage: [
      'https://res.cloudinary.com/demo/image/upload/vaporfly-1.jpg',
      'https://res.cloudinary.com/demo/image/upload/vaporfly-2.jpg'
    ]
  }
];

// Seeder function
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

// Run seeder
seedProducts();