import PropTypes from 'prop-types';
import React from 'react';

import { useMyCompanyQuery } from '../../_gen/graphql';
import Image from '../Image';
import DefaultLogo from './DefaultLogo';

interface IProps {
  logo: string;
  companyName: string;
  width: number;
  height: number;
  className?: string;
}

const Logo = ({ width, height, className, logo, companyName }: IProps) => {
  const renderLogo = logo ? (
    <Image
      width={width?.toString()}
      height={height?.toString()}
      className={className}
      alt={`${companyName} logo`}
      src={logo}
    />
  ) : (
    <DefaultLogo width={width} height={height} className={className} />
  );

  return renderLogo;
};

Logo.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  logo: PropTypes.string,
  companyName: PropTypes.string,
};

const LogoWrapped = (props) => {
  const { data, loading, error } = useMyCompanyQuery({
    fetchPolicy: 'network-only',
  });

  if (error || loading || !data) return null;
  return <Logo logo={data.me.company?.logo} companyName={data.me?.company?.name} {...props} />;
};

export default LogoWrapped;
