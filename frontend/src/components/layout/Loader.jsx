import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <Overlay>
      <StyledWrapper>
        <div className="loader">
          <div className="leaf" />
          <div className="leaf" />
          <div className="leaf" />
        </div>
      </StyledWrapper>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8); /* transparent background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999999; /* on top of everything */
`;


const StyledWrapper = styled.div`
  .loader {
    display: flex;
    gap: .5em;
  }

  .leaf {
    width: 1em;
    height: 3em;
    background-color: rgb(0, 0, 0,.3);
    clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 81%);
    transform: rotate(-30deg);
    animation: color 1200ms infinite;
    animation-delay: 800ms;
  }

  .leaf:nth-child(2) {
    clip-path: polygon(0% 35%,100% 35%,100% 100%,0% 81%);
    animation-delay: 400ms;
  }

  .leaf:nth-child(1) {
    clip-path: polygon(0% 70%,100% 70%,100% 100%,0% 81%);
    animation-delay: 0ms;
  }

  @keyframes color {
    from {
      background-color: lightblue;
    }

    to {
    }
  }`;

export default Loader;
