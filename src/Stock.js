import React, { Component } from "react";
import styled from "styled-components";
import { sidebarBreakpoint, sidebarWidth, stockSize } from "./globals.js";

const Card = styled.div`
  border: 1px solid var(--green);
  border-color: ${props => (props.openFocused ? "var(--green-hover)" : "")};
  display: flex;
  justify-content: space-between;
  height: ${stockSize}rem;
  width: ${stockSize}rem;

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
  position: fixed;
  right: 1.35rem;
  top: 1.25rem;
`;

const Closed = styled.button`
  background: transparent;
  border: none;
  font-size: 1rem;
  height: 100%;
  padding: 0.5rem 1rem 1rem 1rem;
  text-align: left;
  width: 100%;
`;

const Opened = styled.section`
  background: var(--black);
  border: 1px solid var(--green);
  display: ${props => (props.open ? "flex" : "none")};
  flex-direction: column;
  height: calc(100vh - 2rem);
  left: 1rem;
  overflow-y: scroll;
  padding: 0 1rem 1rem 1rem;
  position: fixed;
  top: 1rem;
  width: calc(100vw - 2rem);
  z-index: 2;

  @media (min-width: ${sidebarBreakpoint}rem) {
    left: ${sidebarWidth + 2}rem;
    width: calc(100vw - ${sidebarWidth + 3}rem);
  }
`;

const Meta = styled.div`
  height: 100%;
`;

const Price = styled.p`
  font-size: 4rem;
  transform: translate(-0.45rem, 0.5rem);
`;

const Symbol = styled.h2`
  font-size: 2rem;
  transform: translateX(-0.25rem);
`;

const Tweet = styled.p`
  padding-top: 2rem;
`;

export default class Stock extends Component {
  state = {
    openFocused: false
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      fetch(`/symbol/${this.props.symbol}`, {
        credentials: "same-origin"
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            latestPrice: data.iex.quote.latestPrice,
            tweets: data.twitter.statuses
          });
        })
        .catch(err => {
          console.error("Error ", err);
        });
    }
  }

  render() {
    return (
      <Card open={this.props.open} openFocused={this.state.openFocused}>
        <Closed
          className={this.props.id}
          closed={!this.props.open}
          onBlur={() => this.setState({ openFocused: false })}
          onClick={() => this.props.onClick(this.props.id)}
          onFocus={() => this.setState({ openFocused: true })}
        >
          <Meta>
            <Symbol>${this.props.symbol}</Symbol>
            <p>{this.props.name}</p>
          </Meta>
        </Closed>
        <Opened
          aria-describedby={`${this.props.id}-description`}
          aria-labelledby={`${this.props.id}-title`}
          open={this.props.open}
          role="dialog"
        >
          <div
            style={{
              background: "var(--black)",
              padding: ".5rem 0 1rem 0",
              position: "sticky",
              top: "0"
            }}
          >
            <Symbol id={`${this.props.id}-title`}>${this.props.symbol}</Symbol>
            <p id={`${this.props.id}-description`}>{this.props.name}</p>
            {this.state.latestPrice ? (
              <Price>${this.state.latestPrice}</Price>
            ) : null}
          </div>
          {this.state.tweets
            ? this.state.tweets.map(tweet => (
                <Tweet key={tweet.id}>“{tweet.text}”</Tweet>
              ))
            : null}
          <Close onClick={() => this.props.onClick("")} open={this.props.open}>
            X
          </Close>
        </Opened>
      </Card>
    );
  }
}
