import React from "react"
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

// 군대 테마에 맞는 색상 정의
const colors = {
    primary: '#2E4057', // 군복 느낌의 짙은 청록색
    secondary: '#4F6D7A', // 짙은 청록색의 밝은 버전
    accent: '#5C946E', // 군대 녹색
    highlight: '#F6BD60', // 군대 배지 색상 (금빛)
    background: '#F5F5F5', // 배경색
    text: '#333333', // 텍스트 색상
    textLight: '#6E6E6E' // 밝은 텍스트 색상
};

const Wrapper = styled.nav`
    display: flex;
    padding: 0 20px;
    height: 64px;
    width: 100%;
    background: ${colors.background};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    margin-bottom: 16px;
    align-items: center;
`

const TabLink = styled.button<{ isActive: boolean }>`
    position: relative;
    color: ${props => props.isActive ? colors.primary : colors.textLight};
    font-weight: ${props => props.isActive ? '600' : '400'};
    background: transparent;
    border: none;
    padding: 12px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    
    &:hover {
        color: ${colors.primary};
    }
    
    & + & {
        margin-left: 8px;
    }
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: ${props => props.isActive ? '100%' : '0'};
        height: 3px;
        background-color: ${colors.accent};
        transition: width 0.3s ease;
        border-radius: 3px 3px 0 0;
    }
    
    ${props => props.isActive && `
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 8px;
            height: 8px;
            background-color: ${colors.highlight};
            border-radius: 50%;
            opacity: 0.8;
        }
    `}
`

const BadgeCount = styled.span<{ type?: 'important' | 'new' }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.type === 'important' ? colors.highlight : props.type === 'new' ? colors.accent : colors.secondary};
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    margin-left: 6px;
    min-width: 20px;
    height: 20px;
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
                    필독
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