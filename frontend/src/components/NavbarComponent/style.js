import styled from "styled-components";

export const WrapperLableText = styled.h4`
    color: rgb(56, 56, 61);
    font-size: 14px;
    font-weight: 600;
    margin: 0;
`

export const WrapperTextValue = styled.span`
    color: rgb(56, 56, 61);
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
        color: #9255FD;
        transform: translateX(4px);
    }
`

export const WrapperContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const WrapperTextPrice = styled.div`
    padding: 4px;
    color: rgb(56, 56, 61);
    border-radius: 10px;
    background-color: rgb(238, 238, 238);
    width: fit-content;
`