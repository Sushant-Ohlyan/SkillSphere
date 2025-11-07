import React from 'react'
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';

const Review = () => {
    const [refresh, setRefresh] = React.useState(false);

    const handleReviewAdded = () => {
        setRefresh(!refresh);
    }

    return (
    <div>
      <h1>Product Reviews</h1>
      <ReviewForm onReviewAdded={handleReviewAdded} />
      <ReviewList key={refresh} />
    </div>
  )
}

export default Review