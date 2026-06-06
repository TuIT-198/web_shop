
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TYPE order_status_enum AS ENUM ('pending', 'paid', 'shipping', 'delivered', 'cancelled');
CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'paid', 'refunded', 'failed');
CREATE TYPE payment_method_enum AS ENUM ('cod', 'bank_transfer', 'momo', 'vnpay', 'paypal');

-- 1. NGƯỜI DÙNG (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,   
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    is_admin BOOLEAN DEFAULT FALSE,
    avatar TEXT,
    refresh_token TEXT,               
    address VARCHAR(255),             
    city VARCHAR(100),                
    otp_code VARCHAR(50),
    otp_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. DANH MỤC SẢN PHẨM 

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE, 
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. SẢN PHẨM (products)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,   
    description TEXT,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0,
    main_image TEXT,                    
    images_json JSONB DEFAULT '[]',    
    discount INT DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
    rating DECIMAL(3,2) DEFAULT 5.0,
    sold INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Liên kết sản phẩm - danh mục 
CREATE TABLE product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 4. GIỎ HÀNG (carts) 
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,  
    PRIMARY KEY (cart_id, product_id)
);

-- 5. ĐƠN HÀNG & CHI TIẾT ĐƠN HÀNG
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status order_status_enum DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method_enum,
    payment_status payment_status_enum DEFAULT 'unpaid',
    shipping_method VARCHAR(50),
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    note TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL,    
    discount INT DEFAULT 0,            
    total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price * (100 - discount) / 100) STORED
);

-- Địa chỉ giao hàng 
CREATE TABLE shipping_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    province VARCHAR(50),
    district VARCHAR(50),
    ward VARCHAR(50),
    detail_address VARCHAR(255)
);

-- 6. THANH TOÁN (payments) - lưu lịch sử giao dịch
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL,
    transaction_id VARCHAR(100),      
    status payment_status_enum DEFAULT 'unpaid',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ĐÁNH GIÁ SẢN PHẨM (reviews)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id)  
);

-- INDEXES (tối ưu truy vấn)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);


-- TRIGGERS cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- DỮ LIỆU MẪU 

-- 1. Admin users (password: "admin123" - bcrypt hash)
INSERT INTO users (email, password, full_name, is_admin, address, city) VALUES 
('admin@example.com', '$2a$10$8jlomD81eIWhOVwTbnInxOuSyM4W4cWX20l6hL/5lfx1rNgfk3Yt2', 'Admin System', true, 'Hà Nội', 'Hà Nội'),
('admin@gmail.com', '$2a$10$8jlomD81eIWhOVwTbnInxOuSyM4W4cWX20l6hL/5lfx1rNgfk3Yt2', 'Admin Shop', true, 'Hà Nội', 'Hà Nội');

-- 2. Categories
INSERT INTO categories (name, slug, description) VALUES
('Điện thoại', 'dien-thoai', 'Các dòng điện thoại thông minh'),
('Laptop', 'laptop', 'Máy tính xách tay các loại'),
('Phụ kiện', 'phu-kien', 'Ốp lưng, sạc dự phòng, tai nghe'),
('Tablet', 'tablet', 'Máy tính bảng'),
('VGA', 'vga', 'Card màn hình đồ họa'),
('CPU', 'cpu', 'Bộ vi xử lý máy tính'),
('RAM', 'ram', 'Bộ nhớ truy cập ngẫu nhiên'),
('SSD', 'ssd', 'Ổ cứng thể rắn tốc độ cao');

-- 3. Products
INSERT INTO products (name, slug, description, price, stock_quantity, main_image, discount, sold) VALUES
('Card màn hình ASUS ROG Strix RTX 4090 24GB', 'card-man-hinh-asus-rog-strix-rtx-4090-24gb', 'Card đồ họa đỉnh cao cho game thủ và đồ họa chuyên nghiệp.', 59990000, 5, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80', 10, 12),
('Bộ vi xử lý Intel Core i9-14900K', 'bo-vi-xu-ly-intel-core-i9-14900k', 'CPU thế hệ 14 mới nhất với 24 nhân 32 luồng.', 15490000, 10, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', 5, 25),
('RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 'ram-corsair-vengeance-rgb-32gb-2x16gb-ddr5-6000mhz', 'RAM DDR5 tốc độ cao kèm đèn LED RGB cực đẹp.', 3290000, 20, 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80', 15, 45),
('SSD Samsung 990 Pro 1TB M.2 NVMe PCIe Gen4', 'ssd-samsung-990-pro-1tb-m2-nvme-pcie-gen4', 'Ổ cứng SSD tốc độ đọc ghi siêu tốc lên tới 7450 MB/s.', 2890000, 15, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80', 8, 30);

-- 4. Gán sản phẩm vào danh mục
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c
WHERE (p.name = 'Card màn hình ASUS ROG Strix RTX 4090 24GB' AND c.name = 'VGA')
   OR (p.name = 'Bộ vi xử lý Intel Core i9-14900K' AND c.name = 'CPU')
   OR (p.name = 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz' AND c.name = 'RAM')
   OR (p.name = 'SSD Samsung 990 Pro 1TB M.2 NVMe PCIe Gen4' AND c.name = 'SSD');

-- 5. Tạo một user thường để test
INSERT INTO users (email, password, full_name, phone, is_admin, address, city) VALUES
('customer@example.com', '$2a$10$8jlomD81eIWhOVwTbnInxOuSyM4W4cWX20l6hL/5lfx1rNgfk3Yt2', 'Nguyễn Văn A', '0909123456', false, '12 Mạc Đĩnh Chi', 'Hồ Chí Minh');

