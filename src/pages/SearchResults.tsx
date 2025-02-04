import { useSearchParams } from 'react-router-dom';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <div>
      <h1>Search Results</h1>
      <p>Location: {searchParams.get('location')}</p>
      <p>Category: {searchParams.get('category')}</p>
      <p>Start Date: {searchParams.get('startDate')}</p>
      <p>End Date: {searchParams.get('endDate')}</p>
    </div>
  );
};

export default SearchResults;