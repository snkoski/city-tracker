type HeaderProps = {
  onShowResources: () => void;
  onShowStates: () => void;
  showResources: boolean;
};

export const Header = ({ onShowResources, showResources, onShowStates }: HeaderProps) => {
  return (
    <header className="mb-auto">
      <div>
        <h1>City Tracker</h1>
        {showResources ? (
          <button type="button" onClick={() => onShowStates()}>
            Back to states
          </button>
        ) : (
          <button type="button" onClick={() => onShowResources()}>
            Resources
          </button>
        )}
      </div>
    </header>
  );
};
