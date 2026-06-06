import { Col, Image, Rate, Row } from 'antd'
import React from 'react'
import { WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleNameProduct, WrapperStyleTextSell, WrapperPriceProduct, WrapperPriceTextProduct, WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber } from './style'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct,resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import { useEffect } from 'react'
import * as message from '../Message/Message'
import { useMemo } from 'react'

const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => { 
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }



    useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {
        if(order.isSuccessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSuccessOrder])

    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }
        }else {
            if(!limited) {
                setNumProduct(numProduct - 1)
            }
        }
    }

    const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})
    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname})
        }else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,
                        image: productDetails?.image,
                        price: Number(productDetails?.price),
                        product: productDetails?._id,
                        discount: Number(productDetails?.discount) || 0,
                        countInstock: productDetails?.countInStock
                    }
                }))
            } else {
                setErrorLimitOrder(true)
            }
        }
    }

    return (
        <Loading isLoading={isLoading}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '20px' }}>
                <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px', height:'100%' }}>
                    <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                        <Image src={productDetails?.image} alt="image prodcut" preview={false} />
                        <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                            <WrapperStyleColImage span={4}>
                                <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                            </WrapperStyleColImage>
                        </Row>
                    </Col>
                    <Col span={14} style={{ paddingLeft: '10px' }}>
                        <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                        <div>
                            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                            <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 0}+</WrapperStyleTextSell>
                        </div>
                        <WrapperPriceProduct>
                            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                        </WrapperPriceProduct>
                        <WrapperAddressProduct>
                            <span>Giao đến </span>
                            <span className='address'>{user?.address}</span> -
                            <span className='change-address'>Đổi địa chỉ</span>
                        </WrapperAddressProduct>

                        <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                            <div style={{ marginBottom: '10px' }}>Số lượng</div>
                            <WrapperQualityProduct>
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
                                    <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size="small" />
                                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>
                                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                                </button>
                            </WrapperQualityProduct>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ButtonComponent
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    height: '48px',
                                    width: '220px',
                                    border: 'none',
                                    borderRadius: '4px'
                                }}
                                onClick={handleAddOrderProduct}
                                textbutton={'Đặt mua'}
                                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                            />
                            {errorLimitOrder && <div style={{color: 'red'}}>Sản phẩm đã hết hàng</div>}
                        </div>
                    </Col>
                </Row >
                {productDetails?.description && (
                    <div style={{ padding: '20px', background: '#fff', borderRadius: '4px', border: '1px solid #e5e5e5' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#333', borderBottom: '2px solid #9255FD', width: 'fit-content', paddingBottom: '5px' }}>
                            Mô tả sản phẩm
                        </div>
                        <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line' }}>
                            {productDetails?.description}
                        </div>
                    </div>
                )}
            </div>
        </Loading>
    )
}

export default ProductDetailsComponent