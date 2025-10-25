import mongoose from "mongoose";
import dotenv from "dotenv";
import Products from "../models/products.js";

dotenv.config();

const products = [
  {
    productname: 'Nike Air Zoom Pegasus 40',
    description: 'Responsive cushioning for everyday running with updated mesh upper for breathability',
    category: ['daily', 'tempo'],
    price: 130,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'Adidas Adizero Adios Pro 3',
    description: 'Carbon-plated racing shoe designed for marathon performance',
    category: ['marathon', 'race'],
    price: 250,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'ASICS Gel-Nimbus 25',
    description: 'Maximum cushioning for long-distance comfort and support',
    category: ['daily', 'marathon'],
    price: 160,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'New Balance FuelCell SuperComp Elite v3',
    description: 'Elite racing shoe with dual-plate system for explosive speed',
    category: ['race'],
    price: 275,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'Brooks Ghost 15',
    description: 'Reliable everyday trainer with smooth transitions and soft cushioning',
    category: ['daily'],
    price: 140,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'Saucony Endorphin Speed 3',
    description: 'Versatile tempo shoe with nylon plate for speed training',
    category: ['tempo', 'race'],
    price: 170,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'Hoka Clifton 9',
    description: 'Lightweight daily trainer with plush cushioning and smooth ride',
    category: ['daily'],
    price: 145,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  },
  {
    productname: 'Nike Vaporfly 3',
    description: 'Premium carbon-plated racer for marathon and road racing',
    category: ['marathon', 'race'],
    price: 260,
    productimage: [
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png',
      'https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png'
    ]
  }
];

// Seeder function
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB');

    // Insert new products
    await Products.insertMany(products);
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