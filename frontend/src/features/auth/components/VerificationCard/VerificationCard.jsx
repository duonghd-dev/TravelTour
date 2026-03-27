import './VerificationCard.scss';

const VerificationCard = () => {
  return (
    <div className="verification-card">
      <div className="card-image">
        <div className="image-placeholder">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            {/* Building facade */}
            <rect
              x="40"
              y="50"
              width="220"
              height="200"
              fill="#d4a574"
              stroke="#9e7a52"
              strokeWidth="2"
            />

            {/* Windows row 1 */}
            <rect
              x="60"
              y="80"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="75"
              y1="80"
              x2="75"
              y2="110"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="95"
              x2="90"
              y2="95"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="110"
              y="80"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="125"
              y1="80"
              x2="125"
              y2="110"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="110"
              y1="95"
              x2="140"
              y2="95"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="160"
              y="80"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="175"
              y1="80"
              x2="175"
              y2="110"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="160"
              y1="95"
              x2="190"
              y2="95"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="210"
              y="80"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="225"
              y1="80"
              x2="225"
              y2="110"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="210"
              y1="95"
              x2="240"
              y2="95"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            {/* Windows row 2 */}
            <rect
              x="60"
              y="130"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="75"
              y1="130"
              x2="75"
              y2="160"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="60"
              y1="145"
              x2="90"
              y2="145"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="110"
              y="130"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="125"
              y1="130"
              x2="125"
              y2="160"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="110"
              y1="145"
              x2="140"
              y2="145"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="160"
              y="130"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="175"
              y1="130"
              x2="175"
              y2="160"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="160"
              y1="145"
              x2="190"
              y2="145"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            <rect
              x="210"
              y="130"
              width="30"
              height="30"
              fill="#ffd700"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="225"
              y1="130"
              x2="225"
              y2="160"
              stroke="#9e7a52"
              strokeWidth="1"
            />
            <line
              x1="210"
              y1="145"
              x2="240"
              y2="145"
              stroke="#9e7a52"
              strokeWidth="1"
            />

            {/* Entrance */}
            <rect
              x="130"
              y="200"
              width="40"
              height="50"
              fill="#6b5344"
              stroke="#9e7a52"
              strokeWidth="2"
            />
            <circle cx="160" cy="225" r="4" fill="#d4a574" />
          </svg>
        </div>
      </div>

      <div className="card-content">
        <h2>Securing your heritage journey.</h2>
        <p>
          "The preservation of modern history starts with the security of the
          modern traveler."
        </p>
      </div>
    </div>
  );
};

export default VerificationCard;
