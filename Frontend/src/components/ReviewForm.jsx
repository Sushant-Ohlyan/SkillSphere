import React from 'react'

const ReviewForm = ({ onReviewAdded }) => {
     const [ratings, setRatings] = React.useState([]);
    const [comment,setComment]=React.useState('');
    const [message,setMessage]=React.useState('');

    const handleSubmit=async(e)=>{
        e.preventDefault();

        if(!rating || !comment){
            setMessage('Please provide both rating and comment');
            return;
        }

        try{
            const response=await axios.post('/api/reviews', {
                rating: ratings,
                comment
            });
            if(response.data.success){
                setMessage('Review added successfully');
                setRatings([]);
                setComment('');
                onReviewAdded();
            }else{
                setMessage('Failed to add review');
            }
        }catch(error){
            console.error('Error adding review:', error);
            setMessage('Error adding review');
        }
    }

  return (
    <div>ReviewList
        <form onSubmit={handleSubmit}>
            <label >Rating:</label>
            <input
                type="number"
                value={ratings}
                onChange={(e) => setRatings(e.target.value)}
                min="1"
                max="5"
            />
            <label >Comment:</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Submit Review</button>
        </form>
        {message && <p>{message}</p>}
    </div>
  )
}

export default ReviewForm