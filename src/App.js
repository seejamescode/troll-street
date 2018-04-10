import React, { Component } from "react";
import styled from "styled-components";
import Header from "./Header";
import Stock from "./Stock";

const Main = styled.main`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, 16rem);
`;

class App extends Component {
  state = {
    selectedId: "",
    symbols: [
      {
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      },
      {
        id: 5
      },
      {
        id: 6
      },
      {
        id: 7
      },
      {
        id: 8
      },
      {
        id: 9
      },
      {
        id: 10
      }
    ]
  };

  componentDidMount() {
    this.fetchSymbols();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedId !== "" && this.state.selectedId === "") {
      document.getElementsByTagName("body")[0].style.overflow = "initial";
      document.getElementsByTagName("body")[0].style.position = "initial";
    } else if (prevState.selectedId === "" && this.state.selectedId !== "") {
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
      document.getElementsByTagName("body")[0].style.position = "fixed";
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
          symbols: Object.values(symbols).map(item => {
            return {
              id: `${item.quote.symbol}-${item.quote.companyName}`,
              name: item.quote.companyName,
              symbol: item.quote.symbol
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
        <Header onChange={value => this.fetchSymbols(value)} />
        <Main>
          {this.state.symbols.map(item => (
            <Stock
              key={item.id}
              id={item.id}
              name={item.name}
              onClick={id => {
                this.setState({ selectedId: id });
              }}
              open={item.id === this.state.selectedId}
              symbol={item.symbol}
            />
          ))}
        </Main>
      </React.Fragment>
    );
  }
}

export default App;
