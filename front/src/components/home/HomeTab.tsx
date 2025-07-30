import React from "react"
import { IoAddCircle } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../common/Button";

// 군대 테마에 맞는 색상 정의
const colors = {
    primary: '#2E4057', // 군복 느낌의 짙은 청록색
    secondary: '#4F6D7A', // 짙은 청록색의 밝은 버전
    accent: '#5C946E', // 군대 녹색
    highlight: '#F6BD60', // 군대 배지 색상 (금빛)
    background: '#F5F5F5', // 배경색
    text: '#333333', // 텍스트 색상
    textLight: '#6E6E6E', // 밝은 텍스트 색상
    border: '#E0E0E0' // 테두리 색상
};

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    justify-content: space-between;
`

const TabsContainer = styled.div`
    display: flex;
    align-items: center;
`

const TabLink = styled.button<{ $isActive: boolean }>`
    position: relative;
    color: ${props => props.$isActive ? colors.primary : colors.textLight};
    font-weight: ${props => props.$isActive ? '600' : '400'};
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
        width: ${props => props.$isActive ? '100%' : '0'};
        height: 3px;
        background-color: ${colors.accent};
        transition: width 0.3s ease;
        border-radius: 3px 3px 0 0;
    }
    
    ${props => props.$isActive && `
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

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${colors.accent};
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-left: auto;
  
  &:hover {
    background-color: ${colors.primary};
  }
`;

const HomeTab: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleTabClick = (path: string) => {
        navigate(path);
    }
    
    const tabs = [
        { label: '내 보고서', path: '/' },
        { label: '보고서', path: '/reports' }
    ];

    return (
        <Wrapper>
            <TabsContainer>
                {tabs.map((tab, index) => (
                    <TabLink 
                        key={index}
                        $isActive={location.pathname === tab.path}
                        onClick={() => handleTabClick(tab.path)}
                    >
                        {tab.label}
                    </TabLink>
                ))}
            </TabsContainer>
            <StyledButton onClick={() => navigate('/reports/write')}>
                <IoAddCircle size={18} />
                새 보고서 작성
            </StyledButton>
        </Wrapper>
    );
}

export default HomeTab;