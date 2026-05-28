import React, { useEffect, useState } from 'react'
import { Col, Row, Select, Pagination, Breadcrumb } from 'antd'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'

const ProductsPage = () => {
  const searchProduct = useSelector((state) => state.product?.search)
  const [selectedType, setSelectedType] = useState('')
  const [sortType, setSortType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 12

  // Fetch all product types for sidebar
  const fetchProductTypes = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res?.data || []
  }

  const { data: types, isLoading: loadingTypes } = useQuery({
    queryKey: ['product-types'],
    queryFn: fetchProductTypes
  })

  // Fetch products with filter/search/sort
  const fetchProducts = async ({ queryKey }) => {
    const [_key, type, search, sort, page] = queryKey
    
    let url = `${import.meta.env.VITE_API_URL}/product/get-all?limit=${limit}&page=${page - 1}`
    if (type) {
      url += `&filter=type&filter=${type}`
    } else if (search) {
      url += `&filter=name&filter=${search}`
    }
    
    if (sort) {
      const [field, order] = sort.split('-')
      url += `&sort=${order}&sort=${field}`
    }

    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  }

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', selectedType, searchProduct, sortType, currentPage],
    queryFn: fetchProducts,
    keepPreviousData: true
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedType, searchProduct, sortType])

  const handleTypeClick = (type) => {
    setSelectedType(type)
  }

  const handleSortChange = (value) => {
    setSortType(value)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div style={{ background: '#f5f5fa', width: '100%', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ width: '100%', maxWidth: '1270px', margin: '0 auto', padding: '0 15px' }}>
        <Breadcrumb style={{ marginBottom: '15px' }} items={[{ title: <a href="/">Trang chủ</a> }, { title: 'Tất cả sản phẩm' }]} />
        
        <Row gutter={[20, 20]}>
          {/* Sidebar */}
          <Col xs={24} sm={24} md={6} lg={5}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Danh mục sản phẩm</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span 
                  onClick={() => handleTypeClick('')}
                  style={{ 
                    cursor: 'pointer', 
                    color: selectedType === '' ? '#9255FD' : '#242424',
                    fontWeight: selectedType === '' ? 'bold' : 'normal',
                    fontSize: '14px'
                  }}
                >
                  Tất cả sản phẩm
                </span>
                <Loading isLoading={loadingTypes}>
                  {types?.map((type) => (
                    <span 
                      key={type}
                      onClick={() => handleTypeClick(type)}
                      style={{ 
                        cursor: 'pointer', 
                        color: selectedType === type ? '#9255FD' : '#242424',
                        fontWeight: selectedType === type ? 'bold' : 'normal',
                        textTransform: 'capitalize',
                        fontSize: '14px'
                      }}
                    >
                      {type}
                    </span>
                  ))}
                </Loading>
              </div>
            </div>
          </Col>

          {/* Product Listing */}
          <Col xs={24} sm={24} md={18} lg={19}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', minHeight: '500px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, fontWeight: 'bold' }}>
                  {selectedType ? `Danh mục: ${selectedType}` : searchProduct ? `Tìm kiếm cho: "${searchProduct}"` : 'Tất cả sản phẩm'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#555' }}>Sắp xếp:</span>
                  <Select
                    defaultValue=""
                    style={{ width: 180 }}
                    onChange={handleSortChange}
                    options={[
                      { value: '', label: 'Mặc định' },
                      { value: 'price-asc', label: 'Giá tăng dần' },
                      { value: 'price-desc', label: 'Giá giảm dần' },
                      { value: 'rating-desc', label: 'Đánh giá cao nhất' },
                      { value: 'createdAt-desc', label: 'Mới nhất' },
                    ]}
                  />
                </div>
              </div>

              {/* Grid */}
              <Loading isLoading={loadingProducts}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', justifyItems: 'center', minHeight: '300px' }}>
                  {productsData?.data?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      discount={product.discount}
                      selled={product.selled}
                      id={product._id}
                    />
                  ))}
                  {(!productsData?.data || productsData.data.length === 0) && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#888', fontSize: '16px' }}>
                      Không tìm thấy sản phẩm nào.
                    </div>
                  )}
                </div>
              </Loading>

              {/* Pagination */}
              {productsData?.total > limit && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <Pagination 
                    current={currentPage} 
                    total={productsData.total} 
                    pageSize={limit}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProductsPage