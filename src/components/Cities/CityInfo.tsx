import { FormEvent, useState } from 'react';
import { CityFormData, CityFullDetails } from '../../types';

type CityInfoProps = {
  city: CityFullDetails;
  onSubmit: (data: CityFormData, id: number) => Promise<void>;
};
export const CityInfo = ({ city, onSubmit }: CityInfoProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [cityData, setCityData] = useState({
    state: city.state,
    name: city.name,
    population: city.population,
    salesTaxRate: city.salesTaxRate,
    subreddit: city.subreddit,
    naturalDisasters: city.naturalDisasters,
    violentCrimeRate: city.violentCrimeRate,
    propertyCrimeRate: city.propertyCrimeRate,
    lifeExpectancy: city.lifeExpectancy,
    medianIncome: city.medianIncome,
    medianHouseholdIncome: city.medianHouseholdIncome,
    walkabilityScore: city.walkabilityScore,
    bikeScore: city.bikeScore,
    transitScore: city.transitScore,
    schoolRating: city.schoolRating,
    notes: city.notes
  });

  const handleSubmit = async (event: FormEvent) => {
    console.log('city form handle submit start');

    event.preventDefault();
    const formData: CityFormData = {
      stateId: city.stateId,
      name: cityData.name,
      population: cityData.population,
      salesTaxRate: cityData.salesTaxRate,
      subreddit: cityData.subreddit,
      naturalDisasters: cityData.naturalDisasters,
      violentCrimeRate: cityData.violentCrimeRate,
      propertyCrimeRate: cityData.propertyCrimeRate,
      lifeExpectancy: cityData.lifeExpectancy,
      medianIncome: cityData.medianIncome,
      medianHouseholdIncome: cityData.medianHouseholdIncome,
      walkabilityScore: cityData.walkabilityScore,
      bikeScore: cityData.bikeScore,
      transitScore: cityData.transitScore,
      schoolRating: cityData.schoolRating,
      notes: cityData.notes
    };
    console.log('ethnic demographic form after form data creation', formData);
    try {
      await onSubmit(formData, city.id);
      setIsEditing(false);
    } catch (error) {
      setError('Something went wrong - better error message coming soon lol');
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <button className="w-fit" type="button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Detail'}
        </button>
        <button
          className="w-fit border-8 border-green-400 bg-amber-500!"
          type="button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {error}

      <p>
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="name"
            type="text"
            name="name"
            value={cityData.name}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, name: e.target.value };
              })
            }
          />
        ) : (
          city.name
        )}
        , {cityData.state.name}{' '}
      </p>
      <p>
        Population:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="population"
            type="number"
            name="population"
            value={cityData.population || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, population: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.population
        )}
      </p>
      <p>
        Sales Tax Rate:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="salesTaxRate"
            type="text"
            name="salesTaxRate"
            value={cityData.salesTaxRate || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, salesTaxRate: e.target.value };
              })
            }
          />
        ) : (
          city.salesTaxRate || 'N/A'
        )}
      </p>
      <p>
        Subreddit:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="subreddit"
            type="text"
            name="subreddit"
            value={cityData.subreddit || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, subreddit: e.target.value };
              })
            }
          />
        ) : city.subreddit ? (
          <a
            href={city.subreddit ? `https://www.reddit.com/${city.subreddit}` : ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            {city.subreddit}
          </a>
        ) : (
          'N/A'
        )}
      </p>
      <p>
        Natural Disasters:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="naturalDisasters"
            type="text"
            name="naturalDisasters"
            value={cityData.naturalDisasters || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, naturalDisasters: e.target.value };
              })
            }
          />
        ) : (
          city.naturalDisasters || 'N/A'
        )}
      </p>
      <p>
        Violent Crime Rate:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="violentCrimeRate"
            type="text"
            name="violentCrimeRate"
            value={cityData.violentCrimeRate || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, violentCrimeRate: e.target.value };
              })
            }
          />
        ) : (
          city.violentCrimeRate || 'N/A'
        )}
      </p>
      <p>
        Property Crime Rate:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="propertyCrimeRate"
            type="text"
            name="propertyCrimeRate"
            value={cityData.propertyCrimeRate || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, propertyCrimeRate: e.target.value };
              })
            }
          />
        ) : (
          city.propertyCrimeRate || 'N/A'
        )}
      </p>
      <p>
        Life Expectancy:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="lifeExpectancy"
            type="number"
            name="lifeExpectancy"
            value={cityData.lifeExpectancy || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, lifeExpectancy: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.lifeExpectancy || 'N/A'
        )}
      </p>
      <p>
        Median Income:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="medianIncome"
            type="number"
            name="medianIncome"
            value={cityData.medianIncome || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, medianIncome: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.medianIncome || 'N/A'
        )}
      </p>
      <p>
        Median Household Income:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="medianHouseholdIncome"
            type="number"
            name="medianHouseholdIncome"
            value={cityData.medianHouseholdIncome || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, medianHouseholdIncome: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.medianHouseholdIncome || 'N/A'
        )}
      </p>
      <p>
        Walkability Score:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="walkabilityScore"
            type="number"
            name="walkabilityScore"
            value={cityData.walkabilityScore || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, walkabilityScore: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.walkabilityScore || 'N/A'
        )}
      </p>
      <p>
        Bike Score:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="bikeScore"
            type="number"
            name="bikeScore"
            value={cityData.bikeScore || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, bikeScore: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.bikeScore || 'N/A'
        )}
      </p>
      <p>
        Transit Score:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="transitScore"
            type="number"
            name="transitScore"
            value={cityData.transitScore || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, transitScore: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.transitScore || 'N/A'
        )}
      </p>
      <p>
        School Rating:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="schoolRating"
            type="number"
            name="schoolRating"
            value={cityData.schoolRating || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, schoolRating: Number(e.target.value) };
              })
            }
          />
        ) : (
          city.schoolRating || 'N/A'
        )}
      </p>
      <p>
        Notes:{' '}
        {isEditing ? (
          <input
            className="border-2 border-b-fuchsia-500"
            id="notes"
            type="text"
            name="notes"
            value={cityData.notes || 'none'}
            onChange={(e) =>
              setCityData((prevCityData) => {
                return { ...prevCityData, notes: e.target.value };
              })
            }
          />
        ) : (
          city.notes || 'N/A'
        )}
      </p>
    </div>
  );
};
