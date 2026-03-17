require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User')
const Product = require('./models/Product')

const fetchAndFormatProducts = async () => {
  // 1: Clothing, 2: Electronics, 3: Appliances, 4: Grocery, 5: Toys
  const categoryMappings = {
    1: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'tops'],
    2: ['laptops', 'smartphones', 'tablets', 'mobile-accessories'],
    3: ['kitchen-accessories', 'home-decoration', 'furniture'],
    4: ['groceries', 'beauty'],
    5: ['sports-accessories', 'vehicle', 'motorcycle', 'sunglasses'],
  }

  console.log('Fetching realistic mock products from dummyjson.com...')
  const response = await fetch('https://dummyjson.com/products?limit=194')
  const data = await response.json()
  const rawProducts = data.products

  const formattedProducts = []

  // Process each of the 5 main categories
  Object.keys(categoryMappings).forEach(catId => {
    const subcats = categoryMappings[catId]
    if (catId === '5') {
      const realToys = [
        {
          title: 'Lego Space Shuttle',
          image:
            'https://images.unsplash.com/photo-1581557991964-125469da3b8a?w=400&q=80',
          price: 999,
        },
        {
          title: 'Classic Toy Cars',
          image:
            'https://images.unsplash.com/photo-1594732832278-abd644401426?w=400&q=80',
          price: 1499,
        },
        {
          title: 'Rubiks Cube',
          image:
            'https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?w=400&q=80',
          price: 399,
        },
        {
          title: 'Dolls House',
          image:
            'https://images.unsplash.com/photo-1583947215259-38e31be87dd1?w=400&q=80',
          price: 19999,
        },
        {
          title: 'Toy Blaster',
          image:
            'https://images.unsplash.com/photo-1531693855761-39a997ef056e?w=400&q=80',
          price: 1299,
        },
        {
          title: 'Modeling Clay Set',
          image:
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&q=80',
          price: 499,
        },
        {
          title: 'Uno Cards',
          image:
            'https://images.unsplash.com/photo-1610819013703-2dc67fec4631?w=400&q=80',
          price: 149,
        },
        {
          title: 'Chess Set',
          image:
            'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&q=80',
          price: 999,
        },
        {
          title: 'Wooden Building Blocks',
          image:
            'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
          price: 1999,
        },
        {
          title: 'Jenga Blocks',
          image:
            'https://images.unsplash.com/photo-1589254065878-42c71f997bag?w=400&q=80',
          price: 899,
        },
        {
          title: 'Stacking Rings',
          image:
            'https://images.unsplash.com/photo-1596461404969-9ce20c71c7e7?w=400&q=80',
          price: 350,
        },
        {
          title: 'Teddy Bear',
          image:
            'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80',
          price: 1599,
        },
        {
          title: 'Puzzle Set',
          image:
            'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80',
          price: 1199,
        },
        {
          title: 'Remote Control Car',
          image:
            'https://images.unsplash.com/photo-1591461723507-65773294379a?w=400&q=80',
          price: 2999,
        },
        {
          title: 'Drawing Kit',
          image:
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
          price: 1899,
        },
        {
          title: 'Slime Kit',
          image:
            'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400&q=80',
          price: 699,
        },
        {
          title: 'Robot Toy',
          image:
            'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=400&q=80',
          price: 4499,
        },
        {
          title: 'Train Set',
          image:
            'https://images.unsplash.com/photo-1512412852643-d02bc4502808?w=400&q=80',
          price: 3499,
        },
        {
          title: 'Playing Cards',
          image:
            'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?w=400&q=80',
          price: 249,
        },
        {
          title: 'Beach Sand Kit',
          image:
            'https://images.unsplash.com/photo-1533630660682-1d5964c8c7dd?w=400&q=80',
          price: 799,
        },
      ]

      realToys.forEach((toy, i) => {
        formattedProducts.push({
          id: `toy_${i + 1}`,
          title: toy.title,
          brand: 'FunToys',
          price: toy.price,
          description: `This is an amazing ${toy.title} designed for endless fun and creativity. Highly recommended.`,
          category: catId,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
          image_url: toy.image,
          availability: i % 6 === 0 ? 'Out of Stock' : 'In Stock',
          total_reviews: Math.floor(Math.random() * 500) + 10,
          is_prime_deal: i === 0, // exactly 1 prime deal per category
        })
      })
      console.log(`Prepared 20 real toys for category ID ${catId}`)
    } else {
      // Find all raw products matching these subcategories
      const matchingRaw = rawProducts.filter(p => subcats.includes(p.category))

      // Take exactly 20 products
      const selectedRaw = matchingRaw.slice(0, 20)

      selectedRaw.forEach((raw, index) => {
        formattedProducts.push({
          id: `djson_${raw.id}`,
          title: raw.title,
          brand: raw.brand || 'Premium Brand',
          price: Math.round(raw.price * 80), // Approximate conversion to INR
          description: raw.description,
          category: catId,
          rating: raw.rating,
          image_url: raw.thumbnail, // Extremely reliable dummyjson CDN image
          availability: raw.stock > 0 ? 'In Stock' : 'Out of Stock',
          total_reviews: raw.reviews
            ? raw.reviews.length * 15
            : Math.floor(Math.random() * 500) + 10,
          is_prime_deal: index === 0, // exactly 1 prime deal per category
        })
      })

      console.log(
        `Prepared ${selectedRaw.length} genuine products for category ID ${catId}`,
      )
    }
  })

  return formattedProducts
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected for seeding...')

    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log('Cleared existing collections...')

    // Seed User
    const hashedPassword = await bcrypt.hash('lokesh23', 10)
    const user = new User({
      username: 'lokesh',
      password: hashedPassword,
      phoneNumber: '+91 9177125534',
    })
    await user.save()
    console.log('Seeded mock user "lokesh".')

    // Seed Products
    const productsToInsert = await fetchAndFormatProducts()
    await Product.insertMany(productsToInsert)
    console.log(`Successfully seeded ${productsToInsert.length} realistic products.`)

    console.log('Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

seedDB()
