import './ArtisanReviews.scss';

const ArtisanReviews = ({ reviews = [], ratingAverage = 0 }) => {
  // Mock reviews nếu không có dữ liệu thực
  const mockReviews = [
    {
      _id: '1',
      authorName: 'Tâm Hải',
      rating: 5,
      comment:
        '"This was the highlight of my trip to Vietnam. Master An took the time to teach me the intricacies of silk weaving. I now deeply respect the heritage."',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      _id: '2',
      authorName: 'Mark Thompson',
      rating: 5,
      comment:
        '"The workshop itself was well-organized and the artisan shared fascinating stories about the history of his craft. Highly recommended!"',
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  const displayReviews = reviews && reviews.length > 0 ? reviews : mockReviews;

  return (
    <section className="artisan-reviews">
      <div className="artisan-reviews__container">
        <h2 className="artisan-reviews__title">Guest Reflections</h2>

        <div className="artisan-reviews__summary">
          <div className="artisan-reviews__rating-box">
            <div className="artisan-reviews__rating-value">
              {ratingAverage.toFixed(1)}
            </div>
            <div className="artisan-reviews__rating-stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
            <div className="artisan-reviews__rating-label">
              Based on reviews
            </div>
          </div>

          <div className="artisan-reviews__breakdown">
            <div className="artisan-reviews__metric">
              <span className="artisan-reviews__metric-label">
                Storytelling
              </span>
              <div className="artisan-reviews__bar">
                <div
                  className="artisan-reviews__bar-fill"
                  style={{ width: '95%' }}
                ></div>
              </div>
              <span className="artisan-reviews__metric-value">4.9</span>
            </div>

            <div className="artisan-reviews__metric">
              <span className="artisan-reviews__metric-label">
                Workshop Ambiance
              </span>
              <div className="artisan-reviews__bar">
                <div
                  className="artisan-reviews__bar-fill"
                  style={{ width: '92%' }}
                ></div>
              </div>
              <span className="artisan-reviews__metric-value">4.6</span>
            </div>
          </div>
        </div>

        <div className="artisan-reviews__list">
          {displayReviews.map((review) => (
            <div key={review._id} className="artisan-reviews__item">
              <div className="artisan-reviews__item-header">
                <img
                  src={review.avatar}
                  alt={review.authorName}
                  className="artisan-reviews__avatar"
                />
                <div className="artisan-reviews__author-info">
                  <h4 className="artisan-reviews__author-name">
                    {review.authorName}
                  </h4>
                  <div className="artisan-reviews__item-rating">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="artisan-reviews__comment">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="artisan-reviews__footer">
          <button className="artisan-reviews__btn">Read All Reviews →</button>
        </div>
      </div>
    </section>
  );
};

export default ArtisanReviews;
