import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }
    
    html, body, #root {
        min-height: 100%;
    }

    body {
        background: #7159c7;    
        font-family: Arial, Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased !important;
    }

    button {
        cursor: pointer;
    }
`;