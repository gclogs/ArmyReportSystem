import React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.nav`
    display: flex;
    padding: 0 20px;
    height: 64px;
    width: 100%;
`

const TabLink = styled.button<{ isActive: boolean }>`
    position: relative;
    color: ${props => props.isActive ? 'black' : 'gray'};
    font-weight: ${props => props.isActive ? 'bold' : 'normal'};
    
    & + & {
        margin-left: 12px;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 20%;
        left: 0;
        width: ${props => props.isActive ? '100%' : '0'};
        height: 2px;
        background-color: black;
        transition: width 0.3s ease;
    }
`

const HomeTab: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (path: string) => {
        navigate(path);
    }
    
    return (
        <Wrapper>
            <TabLink 
                isActive={location.pathname === '/reports/recommended'}
                onClick={() => handleTabClick('/reports/recommended')}>
                    필독f
            </TabLink>
            <TabLink 
                isActive={location.pathname === '/reports/recent'}
                onClick={() => handleTabClick('/reports/recent')}>
                    최신
            </TabLink>
            <TabLink 
                isActive={location.pathname === '/reports/me'}
                onClick={() => handleTabClick('/reports/me')}>
                    내 보고서
            </TabLink>
        </Wrapper>
    )
}

export default HomeTab;