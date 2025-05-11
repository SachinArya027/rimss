import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// Sample products data
const sampleProducts = [
  // Men's Clothing
  {
    name: "Classic Moleskin Jacket",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1608063615781-e2ef8c6dcaea?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    discount: 20,
    category: "men",
    description: "A timeless moleskin jacket that combines durability with style. Perfect for cooler days.",
    stock: 15,
    color: "brown"
  },
  {
    name: "Corduroy Trousers",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "men",
    description: "Comfortable and stylish corduroy trousers that work well for casual and semi-formal occasions.",
    stock: 25,
    color: "blue"
  },
  {
    name: "Tattersall Shirt",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac5?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    discount: 15,
    category: "men",
    description: "A classic tattersall check shirt made from premium cotton. Versatile and comfortable.",
    stock: 30,
    color: "white"
  },
  {
    name: "Wool Sweater",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1614975059251-992f11792b9f?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1638635157088-69a256a66f61?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "men",
    description: "A warm and comfortable wool sweater, perfect for layering during colder months.",
    stock: 20,
    color: "grey"
  },
  {
    name: "Merino Wool Cardigan",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "A premium merino wool cardigan that provides exceptional warmth and comfort with a sophisticated look.",
    stock: 15,
    color: "navy"
  },
  {
    name: "Tailored Blazer",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1594938374182-a57abf7b2019?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "A perfectly tailored blazer made from premium wool blend fabric, ideal for formal occasions.",
    stock: 12,
    color: "charcoal"
  },
  {
    name: "Silk Blouse",
    price: 129.99,
    images: [
      "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=500&h=500",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    discount: 10,
    category: "women",
    description: "An elegant silk blouse that transitions seamlessly from office to evening wear.",
    stock: 18,
    color: "red"
  },
  {
    name: "Cashmere Sweater Dress",
    price: 179.99,
    images: [
      "https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "women",
    description: "A luxurious cashmere sweater dress that offers both comfort and elegance for cooler days.",
    stock: 10,
    color: "beige"
  },
  {
    name: "Tailored Wool Coat",
    price: 299.99,
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1520012218364-3dbe62c99bee?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    discount: 15,
    category: "women",
    description: "A beautifully tailored wool coat with a timeless silhouette, perfect for winter elegance.",
    stock: 8,
    color: "camel"
  },
  {
    name: "Pleated Midi Skirt",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1551163943-3f7fb0b8a8c8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "women",
    description: "A versatile pleated midi skirt that can be dressed up or down for any occasion.",
    stock: 22,
    color: "navy"
  },
  {
    name: "Leather Handbag",
    price: 249.99,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A premium leather handbag with multiple compartments and elegant design.",
    stock: 12,
    color: "black"
  },
  {
    name: "Cashmere Scarf",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1668959901722-627e2277f28d?q=80&w=3388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1520903920243-1d5cdb3840cf?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1584187839579-d9c7449d2871?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1615198999943-1eef342e5a4a?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    discount: 5,
    category: "accessories",
    description: "A luxuriously soft cashmere scarf that adds elegance to any outfit.",
    stock: 22,
    color: "green"
  },
  {
    name: "Linen Dress",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1623609163859-ca93c959b5b8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "women",
    description: "A breezy linen dress perfect for summer days and warm evenings.",
    stock: 15,
    color: "white"
  },
  {
    name: "Leather Watch",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "accessories",
    description: "A classic leather watch with precision movement and timeless design.",
    stock: 18,
    color: "brown"
  },
  {
    name: "Silk Tie",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598879445627-81aa8d93e5bf?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598879445627-81aa8d93e5bf?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A premium silk tie that adds sophistication to any formal outfit.",
    stock: 30,
    color: "navy"
  },
  {
    name: "Leather Belt",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A durable leather belt with a classic buckle, perfect for both casual and formal wear.",
    stock: 25,
    color: "black"
  },
  {
    name: "Wool Fedora Hat",
    price: 69.99,
    images: [
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1533055640609-24b498dfd74c?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1517941823-815bea90d291?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A stylish wool fedora hat that adds a touch of sophistication to any outfit.",
    stock: 15,
    color: "grey"
  },
  // More Men's Clothing
  {
    name: "Slim Fit Jeans",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1604176424472-9d69a5a7d721?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "Classic slim fit jeans with a modern cut, perfect for everyday wear.",
    stock: 35,
    color: "blue"
  },
  {
    name: "Oxford Dress Shirt",
    price: 69.99,
    images: [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1563630423918-b58f07336ac5?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "men",
    description: "A crisp oxford dress shirt made from premium cotton, perfect for formal occasions.",
    stock: 28,
    color: "white"
  },
  {
    name: "Chino Trousers",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "Versatile chino trousers that can be dressed up or down for any occasion.",
    stock: 32,
    color: "beige"
  },
  {
    name: "Leather Brogues",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "Classic leather brogues with intricate detailing, perfect for formal occasions.",
    stock: 15,
    color: "brown"
  },
  {
    name: "Patterned Socks",
    price: 12.99,
    images: [
      "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1580910532257-5fe4eabd1d61?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "Colorful patterned socks that add a touch of personality to any outfit.",
    stock: 50,
    color: "multicolor"
  },
  // More Women's Clothing
  {
    name: "Cashmere Sweater",
    price: 159.99,
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1511511450040-677116ff389f?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1542295669297-4d352b042bca?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "women",
    description: "A luxuriously soft cashmere sweater that provides warmth without bulk.",
    stock: 18,
    color: "cream"
  },
  {
    name: "Pencil Skirt",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "women",
    description: "A tailored pencil skirt that creates a sleek silhouette, perfect for office wear.",
    stock: 22,
    color: "black"
  },
  {
    name: "Silk Pajama Set",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "women",
    description: "A luxurious silk pajama set that combines comfort with elegance for a restful night's sleep.",
    stock: 14,
    color: "navy"
  },
  {
    name: "Leather Ankle Boots",
    price: 189.99,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    discount: 10,
    category: "women",
    description: "Stylish leather ankle boots with a comfortable heel, perfect for all-day wear.",
    stock: 16,
    color: "black"
  },
  // More Accessories
  {
    name: "Leather Wallet",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1517254797898-04edd251bdc1?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A premium leather wallet with multiple card slots and a sleek design.",
    stock: 25,
    color: "brown"
  },
  {
    name: "Sunglasses",
    price: 129.99,
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1625591340248-6d695a2a394c?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "accessories",
    description: "Stylish sunglasses with UV protection, perfect for sunny days.",
    stock: 30,
    color: "black"
  },
  {
    name: "Silk Pocket Square",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=500&h=500",
    ],
    isFeatured: false,
    category: "accessories",
    description: "A silk pocket square that adds a touch of elegance to any formal outfit.",
    stock: 40,
    color: "multicolor"
  },
  {
    name: "Wool Beanie",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1510598155802-7cca52a76891?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A cozy wool beanie that keeps you warm while adding style to your winter outfits.",
    stock: 25,
    color: "grey"
  },
  {
    name: "Leather Messenger Bag",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "accessories",
    description: "A premium leather messenger bag with multiple compartments, perfect for work or travel.",
    stock: 15,
    color: "brown"
  },
  {
    name: "Cashmere Beanie",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1510598155802-7cca52a76891?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A luxurious cashmere beanie that provides exceptional warmth and comfort.",
    stock: 18,
    color: "black"
  },
  {
    name: "Leather Laptop Sleeve",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1603913996638-c01100417b4a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1603913996638-c01100417b4a?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1603913996638-c01100417b4a?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "accessories",
    description: "A premium leather laptop sleeve that protects your device in style.",
    stock: 22,
    color: "brown"
  },
  {
    name: "Linen Blazer",
    price: 179.99,
    images: [
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1594938374182-a57abf7b2019?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "men",
    description: "A lightweight linen blazer, perfect for summer formal occasions.",
    stock: 18,
    color: "beige"
  },
  {
    name: "Cotton Polo Shirt",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: false,
    category: "men",
    description: "A classic cotton polo shirt that combines comfort with a smart casual look.",
    stock: 30,
    color: "navy"
  },
  {
    name: "Silk Blouse - White",
    price: 119.99,
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=500&h=500",
      "https://images.unsplash.com/photo-1551489186-cf8726f514f8?auto=format&fit=crop&w=500&h=500"
    ],
    isFeatured: true,
    category: "women",
    description: "An elegant white silk blouse that transitions seamlessly from office to evening wear.",
    stock: 20,
    color: "white"
  }
];

// Sample offers data
const sampleOffers = [
  {
    title: "Summer Collection Sale",
    description: "Get up to 50% off on our latest summer collection. Limited time offer!",
    images: ["https://images.unsplash.com/photo-1562886877-f12251816e01?auto=format&fit=crop&w=800&h=400"],
    discount: "50% OFF",
    validUntil: "2025-06-15",
    category: "seasonal",
    isActive: true
  },
  {
    title: "New Season Arrivals",
    description: "Discover our fresh new styles for the upcoming season. Shop now!",
    images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&h=400"],
    discount: "NEW",
    validUntil: "2025-06-20",
    category: "new-arrivals",
    isActive: true
  },
  {
    title: "Premium Collection",
    description: "Exclusive deals on our premium range. Luxury meets affordability.",
    images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=400"],
    discount: "30% OFF",
    validUntil: "2025-06-12",
    category: "premium",
    isActive: true
  }
];

// Sample orders data for testing
const sampleOrders = [
  {
    userId: "sample-user-id",
    orderDate: new Date().toISOString(),
    orderItems: [
      {
        productId: "sample-product-id-1",
        name: "Classic Moleskin Jacket",
        price: 199.99,
        discount: 20,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&h=500"
      },
      {
        productId: "sample-product-id-2",
        name: "Corduroy Trousers",
        price: 89.99,
        discount: 0,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=500&h=500"
      }
    ],
    shippingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main St",
      addressLine2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States"
    },
    paymentMethod: "Credit Card",
    paymentId: "sample-payment-id",
    subtotal: 379.97,
    shippingCost: 0,
    discount: 39.99,
    total: 339.98,
    status: "completed"
  }
];

// Function to check if collection is empty
const isCollectionEmpty = async (collectionName: string): Promise<boolean> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.empty;
};

// Function to clear existing data
const clearCollection = async (collectionName: string): Promise<void> => {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  // Documents cleared successfully
};

// Function to initialize products
const initializeProducts = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('products');
  
  if (!isEmpty && !forceReset) {
    // Products collection already contains data, skip initialization
    return;
  }
  
  if (!isEmpty && forceReset) {
    await clearCollection('products');
  }
  
  const productsCollection = collection(db, 'products');
  const addPromises = sampleProducts.map(product => addDoc(productsCollection, product));
  await Promise.all(addPromises);
  // Products added successfully
};

// Function to initialize offers
const initializeOffers = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('offers');
  
  if (!isEmpty && !forceReset) {
    // Offers collection already contains data, skip initialization
    return;
  }
  
  if (!isEmpty && forceReset) {
    await clearCollection('offers');
  }
  
  const offersCollection = collection(db, 'offers');
  const addPromises = sampleOffers.map(offer => addDoc(offersCollection, offer));
  await Promise.all(addPromises);
  // Offers added successfully
};

// Function to initialize orders
const initializeOrders = async (forceReset = false): Promise<void> => {
  const isEmpty = await isCollectionEmpty('orders');
  
  if (!isEmpty && !forceReset) {
    // Orders collection already contains data, skip initialization
    return;
  }
  
  if (!isEmpty && forceReset) {
    await clearCollection('orders');
  }
  
  const ordersCollection = collection(db, 'orders');
  const addPromises = sampleOrders.map(order => addDoc(ordersCollection, order));
  await Promise.all(addPromises);
  // Orders added successfully
};

// Main initialization function
export const initializeFirestore = async (forceReset = false): Promise<void> => {
  try {
    // Start Firestore initialization
    await initializeProducts(forceReset);
    await initializeOffers(forceReset);
    await initializeOrders(forceReset);
    // Firestore initialization completed successfully
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};
