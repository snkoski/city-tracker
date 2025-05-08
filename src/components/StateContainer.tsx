import { ReactNode } from 'react';

type StateContainerProps = {
  children: ReactNode;
};

const StateContainer = ({ children }: StateContainerProps) => {
  return <div className="w-full h-full">{children}</div>;
};

export default StateContainer;
