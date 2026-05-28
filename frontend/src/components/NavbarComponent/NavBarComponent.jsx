import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WrapperContent, WrapperLableText, WrapperTextValue } from './style'
import * as ProductService from '../../services/ProductService'
import Loading from '../LoadingComponent/Loading'

const NavBarComponent = () => {
    const navigate = useNavigate()
    const [typeProducts, setTypeProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchAllTypeProduct = async () => {
        setLoading(true)
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    const handleNavigatetype = (type) => {
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: type })
    }

    return (
        <div style={{ background: '#fff', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <WrapperLableText style={{ borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>
                Danh mục sản phẩm
            </WrapperLableText>
            <Loading isLoading={loading}>
                <WrapperContent style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {typeProducts.map((item) => (
                        <WrapperTextValue key={item} onClick={() => handleNavigatetype(item)}>
                            {item}
                        </WrapperTextValue>
                    ))}
                </WrapperContent>
            </Loading>
        </div>
    )
}

export default NavBarComponent