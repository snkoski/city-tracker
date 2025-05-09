import { ReactNode } from 'react';

type StateContainerProps = {
  children: ReactNode;
};

const StateContainer = ({ children }: StateContainerProps) => {
  return <div className="h-full border-s-black border-2 rounded-md p-4 w-fit">{children}</div>;
};

export default StateContainer;
