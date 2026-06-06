const { Product, Category, ProductCategory } = require("../models");
const { Op, Sequelize } = require("sequelize");

const slugify = (text) => {
    if (!text) return '';
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const createProduct = async (newProduct) => {
    const { name, image, type, countInStock, price, rating, description, discount } = newProduct;
    try {
        const checkProduct = await Product.findOne({
            where: { name: name }
        });
        if (checkProduct !== null) {
            return {
                status: 'ERR',
                message: 'Tên sản phẩm đã tồn tại'
            };
        }

        const [category] = await Category.findOrCreate({
            where: { name: type },
            defaults: {
                slug: slugify(type)
            }
        });

        const createdProduct = await Product.create({
            name,
            slug: slugify(name),
            image,
            countInStock: Number(countInStock),
            price: Number(price),
            rating: Number(rating) || 5.0,
            description,
            discount: Number(discount),
        });

        if (createdProduct) {
            await createdProduct.addCategory(category);
            const productData = createdProduct.toJSON();
            productData.type = type;
            return {
                status: 'OK',
                message: 'SUCCESS',
                data: productData
            };
        }
    } catch (e) {
        throw e;
    }
};

const updateProduct = async (id, data) => {
    try {
        const checkProduct = await Product.findByPk(id);
        if (checkProduct === null) {
            return {
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            };
        }

        if (data.type) {
            const [category] = await Category.findOrCreate({
                where: { name: data.type },
                defaults: {
                    slug: slugify(data.type)
                }
            });
            await checkProduct.setCategories([category]);
        }

        if (data.name) {
            data.slug = slugify(data.name);
        }

        await Product.update(data, { where: { _id: id } });
        const updatedProduct = await Product.findByPk(id, {
            include: [{ model: Category }]
        });
        const productJSON = updatedProduct.toJSON();
        productJSON.type = updatedProduct.Categories?.[0]?.name || '';
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: productJSON
        };
    } catch (e) {
        throw e;
    }
};

const deleteProduct = async (id) => {
    try {
        const checkProduct = await Product.findByPk(id);
        if (checkProduct === null) {
            return {
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            };
        }

        await Product.destroy({ where: { _id: id } });
        return {
            status: 'OK',
            message: 'Xóa sản phẩm thành công',
        };
    } catch (e) {
        throw e;
    }
};

const deleteManyProduct = async (ids) => {
    try {
        await Product.destroy({ where: { _id: ids } });
        return {
            status: 'OK',
            message: 'Xóa sản phẩm thành công',
        };
    } catch (e) {
        throw e;
    }
};

const getDetailsProduct = async (id) => {
    try {
        const product = await Product.findByPk(id, {
            include: [{ model: Category }]
        });
        if (product === null) {
            return {
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            };
        }
        const productJSON = product.toJSON();
        productJSON.type = product.Categories?.[0]?.name || '';
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: productJSON
        };
    } catch (e) {
        throw e;
    }
};

const getAllProduct = async (limit, page, sort, filter) => {
    try {
        const where = {};
        const include = [{ model: Category }];
        let isSearchMode = false;

        if (filter) {
            const label = filter[0];
            if (label === 'type') {
                include[0].where = {
                    name: {
                        [Op.iLike]: `%${filter[1]}%`
                    }
                };
            } else if (label === 'search') {
                // Combined search: match product name OR category type
                isSearchMode = true;
                // First, find products matching by name
                where.name = {
                    [Op.iLike]: `%${filter[1]}%`
                };
            } else {
                where[label] = {
                    [Op.iLike]: `%${filter[1]}%`
                };
            }
        }

        const order = [];
        if (sort) {
            order.push([sort[1], sort[0].toUpperCase()]);
        }
        order.push(['createdAt', 'DESC']);
        order.push(['updatedAt', 'DESC']);

        let allProduct;
        let totalProduct;

        if (isSearchMode) {
            // Search by name
            const byName = await Product.findAll({
                where: { name: { [Op.iLike]: `%${filter[1]}%` } },
                order,
                include: [{ model: Category }]
            });

            // Search by category type
            const byType = await Product.findAll({
                where: {},
                order,
                include: [{
                    model: Category,
                    where: { name: { [Op.iLike]: `%${filter[1]}%` } }
                }]
            });

            // Merge and deduplicate
            const productMap = new Map();
            [...byName, ...byType].forEach(p => {
                if (!productMap.has(p._id)) {
                    productMap.set(p._id, p);
                }
            });
            const merged = Array.from(productMap.values());
            totalProduct = merged.length;

            // Manual pagination
            const offset = Number(page * limit) || 0;
            const lim = Number(limit) || merged.length;
            allProduct = merged.slice(offset, offset + lim);
        } else {
            const options = {
                where,
                order,
                include
            };

            if (limit) {
                options.limit = Number(limit);
                options.offset = Number(page * limit);
            }

            allProduct = await Product.findAll(options);

            if (filter && filter[0] === 'type') {
                totalProduct = await Product.count({
                    include: [{
                        model: Category,
                        where: {
                            name: {
                                [Op.iLike]: `%${filter[1]}%`
                            }
                        }
                    }]
                });
            } else {
                totalProduct = await Product.count({ where });
            }
        }

        const mappedProducts = allProduct.map(product => {
            const json = product.toJSON();
            json.type = product.Categories?.[0]?.name || '';
            return json;
        });

        return {
            status: 'OK',
            message: 'SUCCESS',
            data: mappedProducts,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / (limit || totalProduct || 1))
        };
    } catch (e) {
        throw e;
    }
};

const getAllType = async () => {
    try {
        const allType = await Category.findAll({
            attributes: ['name'],
            raw: true
        });
        return {
            status: 'OK',
            message: 'SUCCESS',
            data: allType.map(item => item.name),
        };
    } catch (e) {
        throw e;
    }
};

const deleteType = async (typeName) => {
    try {
        const category = await Category.findOne({ where: { name: typeName } });
        if (!category) {
            return {
                status: 'ERR',
                message: 'Loại sản phẩm không tồn tại'
            };
        }

        // Remove associations in ProductCategory
        await ProductCategory.destroy({ where: { categoryId: category.id } });

        // Delete the category
        await category.destroy();

        return {
            status: 'OK',
            message: 'Xóa loại sản phẩm thành công'
        };
    } catch (e) {
        throw e;
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
    deleteType
};