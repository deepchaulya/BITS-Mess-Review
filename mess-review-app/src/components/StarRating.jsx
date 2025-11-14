import { useState } from 'react';

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'medium' }) => {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const starSize = sizeClasses[size] || sizeClasses.medium;

  // Calculate fill percentage for each star
  const getStarFillPercentage = (starPosition) => {
    const currentRating = hover || rating;
    if (currentRating >= starPosition) {
      return 100; // Full star
    } else if (currentRating > starPosition - 1) {
      // Partial star - calculate percentage
      return (currentRating - (starPosition - 1)) * 100;
    }
    return 0; // Empty star
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = readonly ? getStarFillPercentage(star) : (star <= (hover || rating) ? 100 : 0);

        return (
          <button
            key={star}
            type="button"
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform relative ${starSize}`}
            onClick={() => !readonly && onRatingChange && onRatingChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
          >
            <div className="relative" style={{ width: '100%', height: '100%' }}>
              {/* Gray background star */}
              <svg
                className={`absolute inset-0 ${starSize} text-gray-300`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>

              {/* Gold foreground star with percentage width */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <svg
                  className={`${starSize} text-yellow-400`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
            </div>
          </button>
        );
      })}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export default StarRating;
