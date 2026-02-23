import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API calls
vi.mock('./services/api', () => ({
  fetchNews: vi.fn(() => Promise.resolve([])),
  fetchPrices: vi.fn(() => Promise.resolve({})),
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

describe('App', () => {
  it('renders the header with title', () => {
    render(<App />);
    expect(screen.getByText('CryptNews')).toBeTruthy();
  });
});
