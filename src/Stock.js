import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import { VictoryAxis, VictoryChart, VictoryLine } from "victory";
import { sidebarBreakpoint, sidebarWidth, stockSize } from "./globals.js";

const expandUp = keyframes`
  0% {
      opacity: 0;
      transform: translateY(5%) scale(0.9);
  }

  100% {
      opacity: 1;
      transform: translateY(0%) scale(1);
  }
`;

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
    box-shadow: 0 0 0.25rem var(--green);
    outline: none;
  }
`;

const Chart = styled.div`
  max-width: 75vh;
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
  animation: ${expandUp} 300ms ease-in;
  background: var(--black);
  border: 1px solid var(--green);
  display: ${props => (props.open ? "flex" : "none")};
  flex-direction: column;
  height: calc(100vh - 2rem);
  left: 1rem;
  overflow-y: scroll;
  padding: 0.5rem 1rem 1rem 1rem;
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

const Story = styled.a`
  font-style: italic;
  padding-top: 1rem;
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
            chart: data.iex.chart.map(item => {
              return {
                date: new Date(item.date),
                close: item.close
              };
            }),
            latestPrice: data.iex.quote.latestPrice,
            news: data.iex.news,
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
          <Symbol id={`${this.props.id}-title`}>${this.props.symbol}</Symbol>
          <p id={`${this.props.id}-description`}>{this.props.name}</p>
          {this.state.latestPrice ? (
            <Price>${this.state.latestPrice}</Price>
          ) : null}
          {this.state.chart ? (
            <Chart>
              <VictoryChart
                animate={{ duration: 300, easing: "cubicOut" }}
                scale={{ x: "time" }}
                style={{
                  axis: { stroke: "var(--green)" },
                  labels: { color: "var(--green)" }
                }}
              >
                <VictoryLine
                  data={this.state.chart}
                  style={{
                    data: { stroke: "var(--green)" }
                  }}
                  x="date"
                  y="close"
                />
                <VictoryAxis
                  style={{
                    axis: { stroke: "var(--green)" },
                    tickLabels: { fill: "var(--green)" }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: "var(--green)" },
                    tickLabels: { fill: "var(--green)" }
                  }}
                />
              </VictoryChart>
            </Chart>
          ) : null}
          <br />
          <h3>Tweets</h3>
          {this.state.tweets
            ? this.state.tweets.map(tweet => (
                <Tweet key={tweet.id}>“{tweet.text}”</Tweet>
              ))
            : null}
          <br />
          <h3>News</h3>
          {this.state.news
            ? this.state.news.map(story => (
                <Story
                  href={story.url}
                  key={story.headline}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {story.headline}
                </Story>
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
