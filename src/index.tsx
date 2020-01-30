import React, {forwardRef} from 'react'
import {
  Route,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  NavLink as RouterNavLink,
  NavLinkProps as RouterNavLinkProps,
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

export type AsyncRouteOptions<P> = AsyncComponentOptions<P> & {
  route?: React.ComponentType<any>
}

export function createAsyncRoute<P>(
  component: AsyncComponentGetter<P>,
  options: AsyncRouteOptions<P> = {}
): AsyncRouteType<P> {
  const {route, ...otherOptions} = options
  const Children = createAsyncComponent<P>(component, otherOptions)
  const AsyncRoute = ({...props}: AsyncRouteProps) => {
    // @ts-ignore
    props.component = Children
    return React.createElement(route || Route, props)
  }
  AsyncRoute.load = Children.load
  return AsyncRoute
}

export function withPreload<P extends NavLinkProps>(
  Component: React.ComponentType<any>
) {
  const AsyncLink = forwardRef<any, P>((initialProps, ref: any) => {
    let props = initialProps
    const preload = initialProps.preload

    if (preload || ref) {
      props = Object.assign({ref}, initialProps)

      if (preload) {
        delete props.preload
        props.onMouseEnter = (
          e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
        ) => {
          initialProps.onMouseEnter?.(e)
          preload?.load()
        }
        props.onTouchStart = (e: React.TouchEvent<HTMLAnchorElement>) => {
          initialProps.onTouchStart?.(e)
          preload?.load()
        }
      }
    }

    return React.createElement(Component, props)
  })

  return AsyncLink
}

export interface LinkProps extends RouterLinkProps {
  preload?: AsyncRouteType<any>
}

export interface NavLinkProps extends RouterNavLinkProps {
  preload?: AsyncRouteType<any>
}

export const Link = withPreload<LinkProps>(RouterLink)
export const NavLink = withPreload<NavLinkProps>(RouterNavLink)
