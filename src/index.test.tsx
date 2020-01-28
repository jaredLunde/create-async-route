/* jest */
import React from 'react'
// import {renderHook} from '@testing-library/react-hooks'
import {render, act, fireEvent} from '@testing-library/react'
import {StaticRouter} from 'react-router'
import {createAsyncRoute, Link} from './index'

const ComponentModule = {
  default: () => <div />,
}
const wrapper = props => <StaticRouter location="/" {...props} />

describe('createAsyncRoute()', () => {
  it('should load regular components w/o loading state', () => {
    const HomeRoute = createAsyncRoute(() => ComponentModule, {
      loading: () => 'Loading...',
    })

    let result
    act(() => {
      result = render(<HomeRoute path="/" />, {wrapper})
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should display loading state', () => {
    const HomeRoute = createAsyncRoute(() => Promise.resolve(ComponentModule), {
      loading: () => 'Loading...',
    })

    let result
    act(() => {
      result = render(<HomeRoute path="/" />, {wrapper})
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('should display error state', async () => {
    const HomeRoute = createAsyncRoute(() => Promise.reject('Error!'), {
      error: exception => exception,
    })

    let result
    await act(async () => {
      result = render(<HomeRoute path="/" />, {wrapper})
    })

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('.load() should return promise', async () => {
    const HomeRoute = createAsyncRoute(() => Promise.resolve('Resolved!'))

    let result

    await act(async () => {
      result = await HomeRoute.load()
    })

    expect(result).toBe('Resolved!')
  })

  it('.load() should prevent loading state in production', async () => {
    const prevEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const HomeRoute = createAsyncRoute(() => Promise.resolve(ComponentModule))

    await act(async () => {
      await HomeRoute.load()
    })

    let result
    act(() => {
      result = render(<HomeRoute path="/" />, {wrapper})
    })

    expect(result.asFragment()).toMatchSnapshot()
    process.env.NODE_ENV = prevEnv
  })
})

describe('<Link>', () => {
  it('should render w/o preload', async () => {
    expect(
      render(<Link to="/" data-testid="link" />, {wrapper}).asFragment()
    ).toMatchSnapshot()
  })

  it('should preload a route onMouseEnter', async () => {
    const HomeRoute = createAsyncRoute(() => Promise.resolve(ComponentModule))
    HomeRoute.load = jest.fn()

    let result
    await act(async () => {
      result = render(<Link to="/" data-testid="link" preload={HomeRoute} />, {
        wrapper,
      })
    })

    expect(HomeRoute.load).not.toBeCalled()
    fireEvent.mouseEnter(result.getByTestId('link'))
    expect(HomeRoute.load).toBeCalled()
  })

  it('should call user-defined onMouseEnter', async () => {
    const HomeRoute = createAsyncRoute(() => Promise.resolve(ComponentModule))
    HomeRoute.load = jest.fn()
    const onMouseEnter = jest.fn()

    let result
    await act(async () => {
      result = render(
        <Link
          to="/"
          data-testid="link"
          onMouseEnter={onMouseEnter}
          preload={HomeRoute}
        />,
        {
          wrapper,
        }
      )
    })

    expect(HomeRoute.load).not.toBeCalled()
    expect(onMouseEnter).not.toBeCalled()
    fireEvent.mouseEnter(result.getByTestId('link'))
    expect(HomeRoute.load).toBeCalled()
    expect(onMouseEnter).toBeCalled()
  })

  it('should call onTouchStart', async () => {
    const HomeRoute = createAsyncRoute(() => Promise.resolve(ComponentModule))
    HomeRoute.load = jest.fn()
    const onTouchStart = jest.fn()

    let result
    await act(async () => {
      result = render(
        <Link
          to="/"
          data-testid="link"
          onTouchStart={onTouchStart}
          preload={HomeRoute}
        />,
        {
          wrapper,
        }
      )
    })

    expect(HomeRoute.load).not.toBeCalled()
    expect(onTouchStart).not.toBeCalled()
    fireEvent.touchStart(result.getByTestId('link'))
    expect(HomeRoute.load).toBeCalled()
    expect(onTouchStart).toBeCalled()
  })
})
