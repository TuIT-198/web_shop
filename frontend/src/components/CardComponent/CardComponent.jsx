import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
import styled from 'styled-components'

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, selled, id } = props
    const navigate = useNavigate()
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() =>  handleDetailsProduct(id)}
        >
            <div
                style={{
                    background: 'linear-gradient(135deg, #9255FD, #6c3fd5)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderTopLeftRadius: '3px',
                    borderBottomRightRadius: '6px',
                    letterSpacing: '0.5px'
                }}
            >Tuny</div>
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span> <StarFilled style={{ fontSize: '12px', color: 'rgb(253, 216, 54)' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {selled || 0}</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ whiteSpace: 'nowrap' }}>{convertPrice(price)}</span>
                {discount > 0 && (
                    <WrapperDiscountText style={{ whiteSpace: 'nowrap' }}>
                        -{discount}%
                    </WrapperDiscountText>
                )}
            </WrapperPriceText>
        </WrapperCardStyle>
    )
}

export default CardComponent