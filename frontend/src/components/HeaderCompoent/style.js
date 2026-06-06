import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    align-items: center;
    gap: 20px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 12px 0;
`

export const WrapperTextHeader = styled(Link)`
    font-size: 24px;
    color: #fff;
    font-weight: 800;
    text-align: left;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: transform 0.2s ease, opacity 0.2s ease;
    &:hover {
        color: #fff;
        opacity: 0.95;
        transform: scale(1.02);
    }
`

export const WrapperHeaderAccout = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 12px;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 20px;
    transition: background-color 0.2s ease;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 13px;
    color: #fff;
    white-space: nowrap;
    font-weight: 500;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    margin: 0;
    padding: 8px 16px;
    font-size: 14px;
    color: #333;
    transition: all 0.2s ease;
    border-radius: 4px;
    &:hover {
        color: #9255FD;
        background-color: #f3edff;
    }
`

export const WrapperCartHeader = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 8px;
    cursor: pointer;
    padding: 6px 16px;
    border-radius: 20px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }
`