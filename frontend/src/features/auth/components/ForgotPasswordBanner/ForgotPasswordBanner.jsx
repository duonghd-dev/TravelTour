import './ForgotPasswordBanner.scss';

const ForgotPasswordBanner = () => {
  return (
    <div className="forgot-password-banner">
      <div className="banner-image">
        <svg
          viewBox="0 0 480 640"
          xmlns="http://www.w3.org/2000/svg"
          className="office-scene"
        >
          {/* Room background */}
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: '#1a2332', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#2d3e4f', stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="480" height="640" fill="url(#skyGrad)" />

          {/* Window */}
          <rect
            x="80"
            y="80"
            width="320"
            height="280"
            fill="#1a2332"
            stroke="#4a5f7f"
            strokeWidth="8"
          />
          <rect
            x="100"
            y="100"
            width="140"
            height="240"
            fill="#87ceeb"
            opacity="0.6"
          />
          <rect
            x="260"
            y="100"
            width="140"
            height="240"
            fill="#87ceeb"
            opacity="0.5"
          />
          <line
            x1="240"
            y1="100"
            x2="240"
            y2="340"
            stroke="#4a5f7f"
            strokeWidth="4"
          />
          <line
            x1="100"
            y1="220"
            x2="400"
            y2="220"
            stroke="#4a5f7f"
            strokeWidth="2"
          />

          {/* Red curtains */}
          <path d="M 80 100 L 100 120 L 100 300 L 80 380 Z" fill="#8b4545" />
          <path d="M 400 100 L 380 120 L 380 300 L 400 380 Z" fill="#8b4545" />

          {/* Ceiling */}
          <rect x="0" y="0" width="480" height="80" fill="#2a3a4a" />
          <line
            x1="60"
            y1="40"
            x2="420"
            y2="40"
            stroke="#3a4a5a"
            strokeWidth="3"
          />
          <line
            x1="60"
            y1="60"
            x2="420"
            y2="60"
            stroke="#3a4a5a"
            strokeWidth="3"
          />

          {/* Desk */}
          <rect x="100" y="400" width="280" height="120" fill="#4a3a2a" />
          <rect x="90" y="510" width="20" height="110" fill="#3a2a1a" />
          <rect x="370" y="510" width="20" height="110" fill="#3a2a1a" />

          {/* Books and items on desk */}
          <rect x="120" y="370" width="40" height="40" fill="#6b5d4f" />
          <rect x="320" y="370" width="40" height="40" fill="#6b5d4f" />

          {/* Lamps */}
          <circle cx="150" cy="320" r="12" fill="#2a2a2a" />
          <path d="M 140 320 L 130 280 L 170 280 Z" fill="#2a2a2a" />
          <rect x="145" y="260" width="10" height="20" fill="#1a1a1a" />

          <circle cx="330" cy="320" r="12" fill="#2a2a2a" />
          <path d="M 320 320 L 310 280 L 350 280 Z" fill="#2a2a2a" />
          <rect x="325" y="260" width="10" height="20" fill="#1a1a1a" />

          {/* Pictures on wall */}
          <rect
            x="40"
            y="400"
            width="30"
            height="30"
            fill="#5a4a3a"
            stroke="#4a3a2a"
            strokeWidth="2"
          />
          <rect
            x="410"
            y="400"
            width="30"
            height="30"
            fill="#5a4a3a"
            stroke="#4a3a2a"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="quote-card">
        <p className="quote">"Preserving the thread of time."</p>
        <p className="subtitle">THE CURATORSHIP ARCHIVE</p>
      </div>
    </div>
  );
};

export default ForgotPasswordBanner;
