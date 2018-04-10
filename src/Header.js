import React, { Component } from "react";
import { DebounceInput } from "react-debounce-input";
import styled from "styled-components";

const Nav = styled.nav`
  padding-top: 1rem;
  position: sticky;
  top: 1rem;

  p {
    font-size: 0.75rem;
    padding-top: 1rem;
  }
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
      border-radius: 0px;
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

class Header extends Component {
  state = {
    searchFocused: false
  };

  render() {
    return (
      <Nav>
        <Title>
          <a href="./">Troll Street</a>
        </Title>
        <InputContainer searchFocused={this.state.searchFocused}>
          <DebounceInput
            debounceTimeout={500}
            minLength={0}
            onBlur={() => this.setState({ searchFocused: false })}
            onChange={e => this.props.onChange(e.target.value)}
            onFocus={() => this.setState({ searchFocused: true })}
            placeholder="SNAP"
          />
        </InputContainer>
        <p>
          Find out how the internet trolls feel about your stock investments.
          Made by{" "}
          <a
            href="https://twitter.com/seejamescode"
            rel="noopener noreferrer"
            target="_blank"
          >
            James Y Rauhut
          </a>.
        </p>
      </Nav>
    );
  }
}

export default Header;
