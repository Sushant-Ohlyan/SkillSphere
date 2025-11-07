import React from 'react'
import axios from 'axios';


const ReviewList = () => {

    const [reviews, setReviews] = React.useState([]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get('/api/reviews');
            setReviews(response.data.reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    React.useEffect(() => {
        fetchReviews();
    }, []);

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>Rating:</strong> {review.rating} <br />
            <strong>Comment:</strong> {review.comment}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ReviewList