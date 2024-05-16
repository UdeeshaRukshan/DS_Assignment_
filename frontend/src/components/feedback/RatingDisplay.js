import React, { useEffect, useState } from 'react';
import { Box, Rating } from '@mui/material';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
const RatingsDisplay = (props) => {
  const [rating, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:8074/api/ratings/${props.idValue}`);
        setRatings(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch ratings');
        setLoading(false);
        console.error('Error fetching ratings:', err);
      }
    };
    console.log(rating)

    fetchRatings();
  }, []);

  return (
    <div>
        <Box sx={{
    
    }}>
  <Rating

    value={5}
    
    readOnly  
   
  />
        </Box>
     
    </div>
  );
};

export default RatingsDisplay;
