const User = require('./UserModel');
const Product = require('./ProductModel');
const Category = require('./CategoryModel');
const ProductCategory = require('./ProductCategoryModel');
const Order = require('./OrderModel');
const OrderItem = require('./OrderItemModel');
const ShippingAddress = require('./ShippingAddressModel');
const Payment = require('./PaymentModel');
const Review = require('./ReviewModel');
const Coupon = require('./CouponModel');
const Cart = require('./CartModel');
const CartItem = require('./CartItemModel');

// 1. User & Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 2. Product & Category (Many-to-Many)
Product.belongsToMany(Category, { through: ProductCategory, foreignKey: 'productId', otherKey: 'categoryId' });
Category.belongsToMany(Product, { through: ProductCategory, foreignKey: 'categoryId', otherKey: 'productId' });

// 3. Category Self-reference (hierarchical)
Category.hasMany(Category, { foreignKey: 'parentId', as: 'subCategories' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parentCategory' });

// 4. Order & OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// 5. OrderItem & Product
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// 6. Order & ShippingAddress
Order.hasOne(ShippingAddress, { foreignKey: 'orderId', onDelete: 'CASCADE' });
ShippingAddress.belongsTo(Order, { foreignKey: 'orderId' });

// 7. Order & Payment
Order.hasMany(Payment, { foreignKey: 'orderId', onDelete: 'CASCADE' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// 8. Product & Review
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

// 9. User & Review
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });

// 10. User & Cart
User.hasOne(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// 11. Cart & CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

// 12. CartItem & Product
CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

module.exports = {
  User,
  Product,
  Category,
  ProductCategory,
  Order,
  OrderItem,
  ShippingAddress,
  Payment,
  Review,
  Coupon,
  Cart,
  CartItem
};
