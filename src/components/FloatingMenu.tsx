/* components/FloatingMenu.scss */

.floating-menu {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  background-color: #252627;
  padding: 0.5rem;
  border-radius: 0.25rem;
  z-index: 1000;
  max-width: 100%; /* Prevent overflow */

  .floating-menu-content {
    display: flex;
    flex-direction: column; /* Arrange AI Writer button and input container vertically */
    align-items: stretch;
  }

  .floating-menu-button {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    color: #ffffffcf;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
    margin-bottom: 0.5rem; /* Space between button and input */
    align-self: flex-start; /* Align the button to the start */

    .icon {
      width: 1rem;
      height: 1rem;
      fill: blueviolet;
      margin-right: 0.5rem;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .ai-input-container {
    display: flex;
    flex-direction: row; /* Arrange input and submit button horizontally */
    align-items: center;
    background-color: #2c2d2f;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    width: auto;

    .ai-input-field {
      flex: 1; /* Allow the input to take up available space */
      padding: 0.4rem;
      margin-right: 0.5rem;
      border: 1px solid #444;
      border-radius: 0.2rem;
      background-color: #3a3b3d;
      color: #fff;
      font-size: 0.9rem;

      &:focus {
        outline: none;
        border-color: #666;
      }

      &:disabled {
        background-color: #555;
        cursor: not-allowed;
      }
    }

    .submit-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 0.2rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin-right: 0.3rem;

      &.error {
        background-color: #f44336; /* Red color for error state */
      }

      background-color: #4caf50; /* Default green color */
      color: #fff;

      .arrow-icon {
        width: 16px;
        height: 16px;
        fill: #fff;
      }

      &:hover:not(:disabled):not(.error) {
        background-color: #45a049;
      }

      &:active:not(:disabled):not(.error) {
        background-color: #3e8e41;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #555;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    }

    /* Removed .close-button styles */

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Responsive Design */
    @media (max-width: 600px) {
      .floating-menu-content {
        flex-direction: column; /* Stack elements vertically on small screens */
        align-items: stretch;
      }

      .floating-menu-button {
        margin-bottom: 0.5rem; /* Space between button and input */
        align-self: stretch; /* Make the button full width */
      }

      .ai-input-container {
        flex-direction: column; /* Stack input and submit button vertically */
        align-items: stretch;
      }

      .ai-input-field {
        margin-right: 0;
        margin-bottom: 0.5rem;
        width: 100%;
      }

      .submit-button {
        width: 100%;
        margin-right: 0;
      }
    }
  }
