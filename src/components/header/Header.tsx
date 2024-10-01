import React from 'react';
import styled from 'styled-components';

export default function Header() {
  return (
    <>
        <Wrapper>
            <Left>
                <p>Test</p>
            </Left>
            <Right>
                <p>test</p>
                <p>test</p>
            </Right>
        </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
    position: relative;
    height: 4rem;
    box-shadow: 0 1px 0 black;
`;

const Right = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 11px;
    text-align: right;
`

const Left = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 11px;
    text-align: left;
`