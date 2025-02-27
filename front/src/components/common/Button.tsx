import styled from "styled-components";

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
padding: 8px 16px;
border: none;
border-radius: 6px;
font-size: 14px;
font-weight: 500;
cursor: pointer;
transition: background-color 0.2s;

background: ${props => {
  switch (props.variant) {
    case 'secondary':
      return '#E5E5EA';
    case 'danger':
      return '#FF3B30';
    default:
      return '#007AFF';
  }
}};

color: ${props => props.variant === 'secondary' ? '#333' : 'white'};

&:hover {
  background: ${props => {
    switch (props.variant) {
      case 'secondary':
        return '#D1D1D6';
      case 'danger':
        return '#FF2D20';
      default:
        return '#0056b3';
    }
  }};
}

&:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
`;