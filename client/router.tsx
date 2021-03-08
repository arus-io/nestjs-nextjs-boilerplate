import NextLink, { LinkProps } from 'next/link';
import NextRouter, { useRouter } from 'next/router';
import React, { Children } from 'react';

let subdomain;
if (typeof window !== 'undefined') {
  [subdomain] = window.location.host.split('.');
}
if (! subdomain) subdomain = 'admin';

// Why this exists? Check out: server/_next.dev.ts
// Basically all routes in admin are internally prefixed with /admin
// but not visible in the URL
const getHref = (href) => (subdomain === 'admin' ? `/admin${href === '/' ? '' : href}` : href);

interface ILinkProps {
  href: string;
  children: any;
  as?: string;
  shallow?: boolean;
  className?: string;
}
export const Link = ({ href, as: _as, ...props }: ILinkProps) => {
  const as = typeof _as === 'undefined' ? href : _as;
  return <NextLink href={getHref(href)} as={as || '/'} {...props} />;
};

interface INavLinkProps extends LinkProps {
  children: any;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}
/**
 * Detect the active link and assign a class to it
 */
export const NavLink = ({ href, children, activeClassName, as, exact = false }: INavLinkProps) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const _href = getHref(href);
  const _pathname = getHref(asPath);

  let className = child.props.className || '';
  if (exact ? _pathname === _href : _pathname.includes(_href.toString())) {
    className = `${className} ${activeClassName}`.trimEnd();
  }

  const _as = typeof as === 'undefined' ? href : as;

  return (
    <NextLink href={_href} as={_as}>
      {React.cloneElement(child, {
        className,
      })}
    </NextLink>
  );
};

export const Router = {
  push: (href, _as?, ...other) => {
    const as = typeof _as === 'undefined' ? href : _as;
    NextRouter.push(getHref(href), as || '/', ...other);
  },
  replace: (href, _as, ...other) => {
    const as = typeof _as === 'undefined' ? href : _as;
    NextRouter.push(getHref(href), as || '/', ...other);
  },
  back: (...args) => {
    (NextRouter.back as any)(args);
  },
  router: NextRouter.router,
};

export default {
  Link,
  NavLink,
  Router,
};
