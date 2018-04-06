import React, { Component } from "react";
import { DebounceInput } from "react-debounce-input";
import styled, { injectGlobal } from "styled-components";
import Stock from "./Stock";

injectGlobal`
  body: {
    overflow: ${props => (props.selectedId !== "" ? "hidden" : null)};
  }
`;
const Main = styled.main`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, 16rem);
  position: relative;
  width: 100%;
`;

const Nav = styled.nav`
  padding-top: 1rem;
  position: sticky;
  top: 1rem;
`;

const InputContainer = styled.form`
  position: relative;

  &:after {
    ${props => (props.searchFocused ? "color: var(--green-hover)" : null)};
    left: 0;
    content: "$";
    font-size: 1rem;
    position: absolute;
    top: 0.75px;
  }

  &:focus,
  &:hover {
    &:after {
      color: var(--green-hover);
    }

    input {
      border-bottom-color: var(--green-hover);
      color: var(--green-hover);
    }
  }

  input {
    background: inherit;
    border: none;
    border-bottom: 1px solid var(--green);
    color: var(--green);
    font-size: 1rem;
    max-width: 100%;
    padding-left: 1ch;
    text-transform: uppercase;

    &:focus {
      border-bottom-color: var(--green-hover);
      color: var(--green-hover);
      outline: none;
    }
  }
`;

const Title = styled.h1`
  font-size: 1rem;
  padding-bottom: 0.75rem;
`;

class App extends Component {
  state = {
    searchFocused: false,
    selectedId: "",
    symbols: []
  };

  componentDidMount() {
    this.fetchSymbols();
  }

  componentDidUpdate() {
    if (this.state.selectedId === "") {
      document.getElementsByTagName("body")[0].style.overflow = "initial";
    } else {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    }
  }

  fetchSymbols = (value = "") => {
    fetch(`/symbols/${encodeURI(value)}`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(symbols => {
        this.setState({
          selectedId: "",
          symbols: symbols.map(item => {
            const name = item.name ? item.name : item.companyName;
            const id = `${item.symbol}-${name}`;
            return {
              id,
              name,
              symbol: item.symbol
            };
          })
        });
      })
      .catch(err => {
        console.error("Error ", err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <header>
          <Nav>
            <Title>
              <a href="./">Trollstreet</a>
            </Title>
            <InputContainer searchFocused={this.state.searchFocused}>
              <DebounceInput
                debounceTimeout={500}
                minLength={0}
                onBlur={() => this.setState({ searchFocused: false })}
                onChange={e => this.fetchSymbols(e.target.value)}
                onFocus={() => this.setState({ searchFocused: true })}
                placeholder="SNAP"
              />
            </InputContainer>
          </Nav>
        </header>
        <Main>
          {this.state.symbols.map(item => (
            <Stock
              hide={
                this.state.selectedId !== "" &&
                item.id !== this.state.selectedId
              }
              key={item.id}
              id={item.id}
              name={item.name}
              onClick={id => this.setState({ selectedId: id })}
              open={item.id === this.state.selectedId}
              selectedId={this.state.selectedId}
              symbol={item.symbol}
            />
          ))}
        </Main>
      </React.Fragment>
    );
  }
}

export default App;
