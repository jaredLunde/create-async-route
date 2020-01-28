<hr>
<div align="center">
  <h1 align="center">
    create-async-route
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=create-async-route">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/create-async-route">
    <img alt="Types" src="https://img.shields.io/npm/types/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Code coverage report" href="https://codecov.io/gh/jaredLunde/create-async-route">
    <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/jaredLunde/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Build status" href="https://travis-ci.com/jaredLunde/create-async-route">
    <img alt="Build status" src="https://img.shields.io/travis/com/jaredLunde/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/create-async-route">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://jaredlunde.mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/create-async-route?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i create-async-route</pre>
<hr>

A factory function for creating asynchronous `react-router` routes and a <Link> component with a preload prop for preloading those routes onMouseEnter

## Quick Start

```jsx harmony
import {createAsyncRoute} from 'create-async-route'

const HomeRoute = createAsyncRoute(() => import('./Home'))

<Router>
  // Use your route
  <HomeRoute path='/'/>
</Router>

// Preload your route generally speaking
HomeRoute.load()

// Preload your route `onMouseEnter` or `onTouchStart` with a <Link>
import {Link} from 'create-async-route'

<Link to='/' preload={HomeRoute}>
  Go home
</Link>
```

## API

```typescript
function createAsyncRoute<P>(
  component: AsyncComponentGetter<P>,
  options?: AsyncComponentOptions<P>
): AsyncRouteType<P>
```

Returns a `<Route>` from `react-router-dom` with a `load` method for
preloading your async component. See [`AsyncRouteType`](#asyncroutetype)

| Argument        | Type                                              | Required? | Description                                                   |
| --------------- | ------------------------------------------------- | --------- | ------------------------------------------------------------- |
| componentGetter | [`AsyncComponentGetter`](#asynccomponentgetter)   | Yes       | A function that returns a Promise e.g. an `import()` function |
| options         | [`AsyncComponentOptions`](#asynccomponentoptions) | No        | See [`AsyncComponentOptions`](#asynccomponentoptions)         |

### `<Link>`

A [`react-router-dom/Link`](https://reacttraining.com/react-router/web/api/Link) component with a `preload` prop

#### Props

This component provides all of the props found in [`react-router-dom/Link`](https://reacttraining.com/react-router/web/api/Link) in addition to the ones below

| Prop    | Type                                     | Required? | Description                                                                                                                     |
| ------- | ---------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| preload | [`AsyncRouteType<any>`](#asyncroutetype) | `false`   | Providing an async route component here will preload that component when `onMouseEnter` or `onTouchStart` is fired on the link. |

### `<NavLink>`

A [`react-router-dom/NavLink`](https://reacttraining.com/react-router/web/api/Link) component with a `preload` prop. See [`<Link>`](#link).

## Types

### `AsyncRouteType`

```typescript
type AsyncRouteType<P> = React.FC<AsyncRouteProps> & {
  load: AsyncComponentGetter<P>
}
```

### `AsyncComponentGetter`

```typescript
type AsyncComponentGetter<P> = () => ModuleComponentInterop<P>

type ModuleComponent<P = any> = {
  [property: string]: React.FunctionComponent<P> | React.ClassType<P, any, any>
}

type ModuleComponentInterop<P> =
  | Promise<ModuleComponent<P>>
  | ModuleComponent<P>
```

### `AsyncComponentOptions`

```typescript
interface AsyncComponentOptions<P> {
  // The property within the module object where
  // your component resides.
  // Default: "default"
  property?: string
  // A component you'd like to display while the async
  // component is loading.
  loading?: (props: P) => React.ReactNode | React.ReactNode[]
  // A component you'd like to display when the async
  // component is Promise is rejected.
  error?: (exception: any, props: P) => React.ReactNode | React.ReactNode[]
}
```

## LICENSE

MIT
