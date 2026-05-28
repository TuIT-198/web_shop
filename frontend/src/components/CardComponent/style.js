import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 220px;
    border-radius: 12px !important;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    border: 1px solid #f0f0f0 !important;
    transition: all 0.25s ease !important;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 32px rgba(146, 85, 253, 0.18) !important;
        border-color: #d9b8ff !important;
    }

    & img {
        height: 200px;
        width: 100%;
        object-fit: cover;
        transition: transform 0.35s ease;
    }

    &:hover img {
        transform: scale(1.05);
    }

    & .ant-card-body {
        padding: 12px !important;
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #262626;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 4px 0 6px;
    gap: 4px;
`

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
`

export const WrapperDiscountText = styled.span`
    display: inline-flex;
    align-items: center;
    background: linear-gradient(135deg, #ff4d4f, #ff7875);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 20px;
    letter-spacing: 0.3px;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 11px;
    line-height: 16px;
    color: rgb(150, 150, 150);
`