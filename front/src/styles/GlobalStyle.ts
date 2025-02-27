import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #111111;
    background-color: #ffffff;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  input, button, textarea {
    font: inherit;
  }

  /* 모바일 터치 하이라이트 제거 */
  -webkit-tap-highlight-color: transparent;

  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export default GlobalStyle;
