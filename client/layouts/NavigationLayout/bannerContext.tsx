import React, { useState } from 'react';
import PropTypes from 'prop-types';

export interface IBannerContext {
  bannerText: string;
  setBannerText: React.Dispatch<React.SetStateAction<string>>;
}

export const BannerContext = React.createContext<IBannerContext>({
  bannerText: '',
  setBannerText: () => undefined,
});

export const BannerContextProvider: React.FC = ({ children }) => {
  const [bannerText, setBannerText] = useState<string>();

  return <BannerContext.Provider value={{ bannerText, setBannerText }}>{children}</BannerContext.Provider>;
};

BannerContextProvider.propTypes = {
  children: PropTypes.node,
};
