import React from 'react'
import {
  Route,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  RouteProps,
} from 'react-router-dom'
import createAsyncComponent, {
  AsyncComponentGetter,
  AsyncComponentOptions,
} from 'create-async-component'

export interface AsyncRouteProps extends RouteProps {
  component?: never
}

export type AsyncRouteType<P> = React.FC<AsyncRouteProps> & {
  load: AsyncComponentGetter<P>
}

export function createAsyncRoute<P>(
  component: AsyncComponentGetter<P>,
  options?: AsyncComponentOptions<P>
): AsyncRouteType<P> {
  const Children = createAsyncComponent<P>(component, options)
  const AsyncRoute = ({...props}: AsyncRouteProps) => {
    // @ts-ignore
    props.component = Children
    return React.createElement(Route, props)
  }
  AsyncRoute.load = Children.load
  return AsyncRoute
}

export interface LinkProps extends RouterLinkProps {
  preload?: AsyncRouteType<any>
}

export const Link: React.FC<LinkProps> = ({preload, ...props}) => {
  const {onMouseEnter, onTouchStart} = props
  props.onMouseEnter = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onMouseEnter?.(e)
    preload?.load()
  }
  props.onTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
    onTouchStart?.(e)
    preload?.load()
  }
  return React.createElement(RouterLink, props)
}
