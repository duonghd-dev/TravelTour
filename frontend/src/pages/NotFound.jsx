import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found__container">
        {/* Left Content */}
        <div className="not-found__content">
          <span className="not-found__label">
            LỖI 404 – TRANG KHÔNG TỒN TẠI
          </span>

          <h1 className="not-found__title">
            Hành trình <span className="not-found__italic">tạm giãn doạn.</span>
          </h1>

          <p className="not-found__quote">
            "Có lẽ con đường này đã bị thời gian che mờ."
          </p>

          {/* Action Buttons */}
          <div className="not-found__actions">
            <button
              className="not-found__btn not-found__btn--primary"
              onClick={() => navigate('/')}
            >
              Quay lại Trang chủ
            </button>
            <button
              className="not-found__btn not-found__btn--secondary"
              onClick={() => navigate('/home')}
            >
              Xem Trải nghiệm
            </button>
            <button
              className="not-found__btn not-found__btn--secondary"
              onClick={() => navigate('/admin/messages')}
            >
              Liên hệ Hỗ trợ
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="not-found__image">
          <div className="not-found__image-placeholder">
            <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
              {/* Stone arch/gate background */}
              <rect width="300" height="400" fill="#4a7c59" opacity="0.3" />

              {/* Outer stone frame */}
              <rect
                x="40"
                y="60"
                width="220"
                height="280"
                fill="none"
                stroke="#5a8c6a"
                strokeWidth="15"
              />
              <rect
                x="55"
                y="75"
                width="190"
                height="250"
                fill="none"
                stroke="#4a7c59"
                strokeWidth="8"
              />

              {/* Inner decorative pattern */}
              <g fill="#6a9c7a" opacity="0.7">
                <circle cx="80" cy="120" r="8" />
                <circle cx="220" cy="120" r="8" />
                <circle cx="80" cy="310" r="8" />
                <circle cx="220" cy="310" r="8" />

                {/* Decorative carved elements */}
                <path
                  d="M 100 140 Q 150 150 200 140"
                  fill="none"
                  stroke="#6a9c7a"
                  strokeWidth="2"
                />
                <path
                  d="M 100 280 Q 150 270 200 280"
                  fill="none"
                  stroke="#6a9c7a"
                  strokeWidth="2"
                />
              </g>

              {/* Moss/age effect */}
              <rect
                x="50"
                y="65"
                width="200"
                height="20"
                fill="#4a7c59"
                opacity="0.4"
              />
              <rect
                x="50"
                y="315"
                width="200"
                height="20"
                fill="#4a7c59"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="not-found__bg-decoration"></div>
    </div>
  );
};

export default NotFound;
