import React from "react"
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HeaderTabWrapper = styled.nav`
    display: flex;
    padding: 0 20px;
    height: 64px;
    width: 100%;
    background-color: black;
`

const TabLink = styled.button`
    color: white;
    padding: 0 16px;
`

const TopNavigation: React.FC = () => {
    const navigate = useNavigate();

    const handleTabClick = (path: string) => {
        navigate(path);
    }
    
    return (
        <HeaderTabWrapper>
            <TabLink onClick={() => handleTabClick('/search')}>검색</TabLink>
            <TabLink onClick={() => handleTabClick('/notifications')}>알림</TabLink>
            <TabLink onClick={() => handleTabClick('/profile')}>프로필</TabLink>
            <TabLink onClick={() => handleTabClick('/settings')}>설정</TabLink>
        </HeaderTabWrapper>
    )
}

export default TopNavigation;