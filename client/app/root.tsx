// eslint-disable-next-line import/no-unresolved
import 'virtual:uno.css'
import "@unocss/reset/tailwind.css"
import './styles.css'

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction, MetaFunction } from '@remix-run/node';

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "/favicon.svg",
      type: "image/svg+xml",
    }
  ];
};

export const meta: MetaFunction = ({ location }) => {
  const currentLocation = location.pathname.slice(1).split('?')
  return [
    { title: `stylEase | ${currentLocation}` }
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
