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
    --green-hover: #CED994;
  }

  * {
    box-sizing: border-box;
    color: var(--green);
    font-family: monospace;
    font-weight: 400;
    margin: 0;
    transition: box-shadow 0.2s linear, text-shadow 0.2s linear;
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
    cursor: pointer;
    outline: none;
    text-shadow: 0 0 0.01rem var(--green-hover), 0 0 2px rgba(255,255,255,0.8);
  }

  a, p {
    max-width: 35rem;
  }

  h3 {
    font-size: 1.5rem;
    padding-top: 2rem;
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
