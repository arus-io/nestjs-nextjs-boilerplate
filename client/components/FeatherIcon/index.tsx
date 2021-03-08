import React from 'react';
import * as icons from 'react-feather';

export type IconName = keyof typeof icons;

export type IProps = {
  name: IconName;
} & icons.IconProps;

/**
 * Visual aid: https://feathericons.com/
 */
export default function FeatherIcon({ name, ...rest }: IProps) {
  const IconComponent = icons[name];

  return <IconComponent {...rest} />;
}
