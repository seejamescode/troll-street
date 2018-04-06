import React, { Component } from "react";
import styled from "styled-components";

const styleSharedWithCard = `
  border: 1px solid var(--green);
  height: 16rem;
  width: 16rem;
`;

const styleSharedWithOpen = `
  padding: 0.5rem 1rem 1rem 1rem;
`;

const Card = styled.div`
  ${styleSharedWithCard}
  border-color: ${props => (props.openFocused ? "var(--green-hover)" : "")};
  display: flex;
  justify-content: space-between;

  &:focus,
  &:hover {
    border-color: var(--green-hover);
    outline: none;
  }
`;

const Close = styled.button`
  align-self: flex-start;
  background: transparent;
  border: none;
  display: ${props => (props.open ? "" : "none")};
  font-size: 2rem;
  margin-right: -0.35rem;
`;

const Closed = styled.button`
  ${styleSharedWithOpen} background: transparent;
  border: none;
  font-size: 1rem;
  height: 100%;
  text-align: left;
  width: 100%;
`;

const Opened = styled.section`
  ${styleSharedWithCard} ${styleSharedWithOpen}
  background: var(--black);
  display: ${props => (props.open ? "flex" : "none")};
  justify-content: space-between;
  height: calc(100vh - 7rem);
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;

  @media (min-width: 28rem) {
    height: calc(100vh - 2rem);
  }
`;

const OpenContent = styled.div`
  height: 100%;
`;

const Symbol = styled.h2`
  font-size: 2rem;
`;

export default class Stock extends Component {
  state = {
    openFocused: false
  };

  componentDidUpdate(prevProps) {
    if (this.state.openFocused && prevProps.open && !this.props.open) {
      this.setState({ openFocused: false });
    }
  }

  render() {
    return (
      <Card open={this.props.open} openFocused={this.state.openFocused}>
        <Closed
          closed={!this.props.open}
          onBlur={() => this.setState({ openFocused: false })}
          onClick={() => {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            this.props.onClick(this.props.id);
          }}
          onFocus={() => this.setState({ openFocused: true })}
        >
          <OpenContent>
            <Symbol>{this.props.symbol}</Symbol>
            <p>{this.props.name}</p>
          </OpenContent>
        </Closed>

        <Opened open={this.props.open}>
          <OpenContent>
            <Symbol>{this.props.symbol}</Symbol>
            <p>{this.props.name}</p>
          </OpenContent>

          <Close onClick={() => this.props.onClick("")} open={this.props.open}>
            X
          </Close>
        </Opened>
      </Card>
    );
  }
}
