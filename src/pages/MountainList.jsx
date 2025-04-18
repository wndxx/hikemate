import { useEffect, useState } from 'react';
import mockApi from '../api/mockApi';
import MountainCard from '../components/mountainCard/MountainCard';

const MountainList = () => {
  const [mountains, setMountains] = useState([]);

  useEffect(() => {
    const loadMountains = async () => {
      try {
        const response = await mockApi.getMountains();
        setMountains(response.data);
      } catch (error) {
        console.error('Failed to load mountains:', error);
      }
    };

    loadMountains();
  }, []);

  return (
    <div className="row">
      {mountains.map(mountain => (
        <div key={mountain.id} className="col-md-4 mb-4">
          <MountainCard mountain={mountain} />
        </div>
      ))}
    </div>
  );
};

export default MountainList;