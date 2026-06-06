const express = require("express");
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const port = process.env.PORT || 5157;

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Cấu hình middleware của express
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Định tuyến
routes(app);

const { User, Product, Category } = require('./models');
const bcrypt = require('bcryptjs');

const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

async function seedDatabase() {
    try {
        // Seed Admin user
        const adminEmail = 'admin@gmail.com';
        const adminExists = await User.findOne({ where: { email: adminEmail } });
        if (!adminExists) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            await User.create({
                name: 'Admin Shop',
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
                phone: '123456789',
                address: 'Hà Nội',
                city: 'Hà Nội'
            });
            console.log('Seeded Admin User: admin / admin123 (email: admin@gmail.com)');
        } else if (!adminExists.username) {
            // Cập nhật username cho admin cũ chưa có username
            await adminExists.update({ username: 'admin' });
            console.log('Updated Admin User: added username=admin');
        }

        // Seed default products
        const productCount = await Product.count();
        if (productCount === 0) {
            const productsToSeed = [
                {
                    name: 'Card màn hình ASUS ROG Strix RTX 4090 24GB',
                    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80',
                    type: 'VGA',
                    price: 59990000,
                    countInStock: 5,
                    rating: 5,
                    description: 'Card đồ họa đỉnh cao cho game thủ và đồ họa chuyên nghiệp.',
                    discount: 10,
                    selled: 12
                },
                {
                    name: 'Bộ vi xử lý Intel Core i9-14900K',
                    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
                    type: 'CPU',
                    price: 15490000,
                    countInStock: 10,
                    rating: 4.8,
                    description: 'CPU thế hệ 14 mới nhất với 24 nhân 32 luồng.',
                    discount: 5,
                    selled: 25
                },
                {
                    name: 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz',
                    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
                    type: 'RAM',
                    price: 3290000,
                    countInStock: 20,
                    rating: 4.5,
                    description: 'RAM DDR5 tốc độ cao kèm đèn LED RGB cực đẹp.',
                    discount: 15,
                    selled: 45
                },
                {
                    name: 'SSD Samsung 990 Pro 1TB M.2 NVMe PCIe Gen4',
                    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
                    type: 'SSD',
                    price: 2890000,
                    countInStock: 15,
                    rating: 4.9,
                    description: 'Ổ cứng SSD tốc độ đọc ghi siêu tốc lên tới 7450 MB/s.',
                    discount: 8,
                    selled: 30
                }
            ];

            for (const item of productsToSeed) {
                const [category] = await Category.findOrCreate({
                    where: { name: item.type },
                    defaults: {
                        slug: slugify(item.type)
                    }
                });

                const createdProduct = await Product.create({
                    name: item.name,
                    slug: slugify(item.name),
                    image: item.image,
                    price: item.price,
                    countInStock: item.countInStock,
                    rating: item.rating,
                    description: item.description,
                    discount: item.discount,
                    selled: item.selled
                });

                await createdProduct.addCategory(category);
            }
            console.log('Seeded default products successfully!');
        }
    } catch (error) {
        console.error('Failed to seed database:', error);
    }
}

// Kết nối & Sync PostgreSQL
sequelize.sync()
    .then(async () => {
        console.log('Connect Database and Sync success!');
        await seedDatabase();
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Khởi động server
app.listen(port, () => {
    console.log('Server is running on port:', port);
});
