import React from "react";
import ReactDOM from "react-dom";
import { injectGlobal } from "styled-components";
import App from "./App";
import { sidebarBreakpoint, sidebarWidth } from "./globals.js";
import registerServiceWorker from "./registerServiceWorker";

injectGlobal`
  :root {
    --black: #1A1717;
    --green: #87DE6D;
    --green-hover: #fff;
  }

  * {
    box-sizing: border-box;
    color: var(--green);
    font-family: monospace;
    font-weight: 400;
    margin: 0;
  }

  html {
    font-size: 16px;
  }

  body {
    background: var(--black);
    padding: 1rem;
    width: 100%;
  }

  a {
    font-weight: 600;
    text-decoration: none;
  }

  a:focus, a:hover, button:focus, button:focus *, button:hover, button:hover * {
    color: var(--green-hover);
    cursor: pointer;
    outline: none;
  }

  p {
    max-width: 40rem;
  }

  #root {
    display: grid;
    grid-gap: 1rem;

    @media (min-width: ${sidebarBreakpoint}rem) {
      grid-template-columns: ${sidebarWidth}rem 1fr;
    }
  }
`;

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
