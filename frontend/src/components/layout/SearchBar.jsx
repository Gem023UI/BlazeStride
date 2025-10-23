import React from 'react';
import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="form">
        <label htmlFor="search">
          <input className="input" type="text" required placeholder="Search running gear..." id="search" />
          <div className="fancy-bg" />
          <div className="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </g>
            </svg>
          </div>
          <button className="close-btn" type="reset">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .form {
    --input-text-color: #fff;
    --text-color: rgba(255, 255, 255, 0.6);
    --active-color: #41b9ff;
    --width-of-input: 600px;
    --inline-padding-of-input: 1.5em;
    --gap: 0.9rem;
  }
  
  /* form style */
  .form {
    font-size: 1rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    width: var(--width-of-input);
    max-width: 90vw;
    position: relative;
    isolation: isolate;
    margin: 0 auto;
  }
  
  /* Glassmorphism background */
  .fancy-bg {
    position: absolute;
    width: 100%;
    inset: 0;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 50px;
    height: 100%;
    z-index: -1;
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* label styling */
  label {
    width: 100%;
    padding: 1em;
    height: 50px;
    padding-inline: var(--inline-padding-of-input);
    display: flex;
    align-items: center;
  }

  .search, .close-btn {
    position: absolute;
  }
  
  /* styling search-icon */
  .search {
    fill: var(--text-color);
    left: var(--inline-padding-of-input);
    transition: fill 0.3s ease;
  }
  
  /* svg -- size */
  svg {
    width: 20px;
    display: block;
  }
  
  /* styling of close button */
  .close-btn {
    border: none;
    right: var(--inline-padding-of-input);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0.1em;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--active-color);
    opacity: 0;
    visibility: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .close-btn:hover {
    transform: scale(1.1);
    background: #fe42b9;
  }
  
  /* styling of input */
  .input {
    color: var(--input-text-color);
    width: 100%;
    margin-inline: min(2.5em, calc(var(--inline-padding-of-input) + var(--gap)));
    background: none;
    border: none;
    font-size: 1rem;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    color: var(--text-color);
  }
  
  /* input background change in focus */
  .input:focus ~ .fancy-bg {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
                0 2px 8px rgba(0, 0, 0, 0.4);
  }
  
  /* search icon color change in focus */
  .input:focus ~ .search {
    fill: var(--active-color);
  }
  
  /* showing close button when typing */
  .input:valid ~ .close-btn {
    opacity: 1;
    visibility: visible;
  }
  
  /* autofill styling */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-text-fill-color: #fff;
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.1) inset;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export default Input;