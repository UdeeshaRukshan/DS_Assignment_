import React from 'react';
import { Box, Rating } from '@mui/material';

const RatingsDisplay = ({ ratings, error }) => {
    return (
        <div>
            {error && <Box sx={{ color: 'red', mt: 2 }}>{error}</Box>}
            {ratings.map((rating) => ( // Only taking the first 5 ratings
                <Box key={rating[0]._id} sx={{ mt: 2 }}>
                    <Rating value={rating[0].value} readOnly />
                    <p>{`Comment: ${rating[0].comment}`}</p>
                </Box>
            ))}
        </div>
    );
};

export default RatingsDisplay;
