import { ReactNode } from 'react';

type CityContainerProps = {
  children: ReactNode;
};

export const CityContainer = ({ children }: CityContainerProps) => {
  return <div className="w-full h-full">{children}</div>;
};
