import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AIInteraction from './AIInteraction';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ response: 'AI response' }),
  })
);

describe('AIInteraction component', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(<AIInteraction />);
    expect(getByPlaceholderText('Ask the AI something...')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('submits input and displays response', async () => {
    const { getByPlaceholderText, getByText } = render(<AIInteraction />);
    const input = getByPlaceholderText('Ask the AI something...');
    const submitButton = getByText('Submit');

    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(getByText('AI Response:')).toBeInTheDocument();
      expect(getByText('AI response')).toBeInTheDocument();
    });
  });
});