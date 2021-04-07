import NextLink, { LinkProps } from 'next/link';
import NextRouter, { useRouter } from 'next/router';
import React, { Children } from 'react';

let subdomain;
if (typeof window !== 'undefined') {
  [subdomain] = window.location.host.split('.');
}
if (! subdomain) subdomain = 'admin';

interface ILinkProps {
  href: string;
  children: any;
  as?: string;
  shallow?: boolean;
  className?: string;
}
export const Link = ({ href, as: _as, ...props }: ILinkProps) => {
  const as = typeof _as === 'undefined' ? href : _as;
  return <NextLink href={href} as={as || '/'} {...props} />;
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

  let className = child.props.className || '';
  if (exact ? asPath === href : asPath.includes(href.toString())) {
    className = `${className} ${activeClassName}`.trimEnd();
  }

  const _as = typeof as === 'undefined' ? href : as;

  return (
    <NextLink href={href} as={_as}>
      {React.cloneElement(child, {
        className,
      })}
    </NextLink>
  );
};

export const Router = {
  push: (href, _as?, ...other) => {
    const as = typeof _as === 'undefined' ? href : _as;
    NextRouter.push(href, as || '/', ...other);
  },
  replace: (href, _as, ...other) => {
    const as = typeof _as === 'undefined' ? href : _as;
    NextRouter.push(href, as || '/', ...other);
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
