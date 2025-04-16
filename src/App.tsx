import CityForm from './components/CityForm';
import CityList from './components/CityList';

function App() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">City Tracker</h1>
      <CityForm
        onSubmit={(data) => {
          console.log('City created successfully:', data);
          // You can add success handling here (e.g., show a success message, refresh the list, etc.)
        }}
      />
      <div className="mt-8">
        <CityList />
      </div>
    </div>
  );
}

export default App;
