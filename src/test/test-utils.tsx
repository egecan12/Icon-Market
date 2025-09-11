import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import iconsReducer from '../store/iconsSlice'
import errorReducer from '../store/errorSlice'
import type { RootState } from '../store/store'
import type { Icon } from '../types'

// Mock icon data for testing
export const mockIcon: Icon = {
  name: 'test-icon',
  category: 'test-category',
  svg: '<svg><rect width="24" height="24"/></svg>'
}

export const mockIcons: Icon[] = [
  mockIcon,
  {
    name: 'second-icon',
    category: 'test-category',
    svg: '<svg><circle r="12"/></svg>'
  },
  {
    name: 'third-icon',
    category: 'another-category',
    svg: '<svg><path d="M0 0"/></svg>'
  }
]

// Create test store
export function createTestStore(initialState?: Partial<RootState>) {
  const store = configureStore({
    reducer: {
      icons: iconsReducer,
      error: errorReducer,
    } as any,
    preloadedState: initialState,
  })
  return store
}

// Custom render function with Redux provider
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Partial<RootState>
  store?: ReturnType<typeof createTestStore>
}

export function renderWithRedux(
  ui: React.ReactElement,
  {
    initialState,
    store = createTestStore(initialState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
