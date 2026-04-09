import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faComments,
  faLightbulb,
  faCircleXmark,
  faHourglass,
  faWandMagicSparkles,
  faRotateRight,
  faRobot,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import aiService from '@/services/api/aiService';
import './AITestPage.scss';

const AITestPage = () => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const suggestion = await aiService.getAISuggestion(message);
      setResponses((prev) => [
        ...prev,
        {
          id: Date.now(),
          question: message,
          answer: suggestion,
        },
      ]);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Lỗi khi gọi Groq AI');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="ai-test-page">
      <div className="ai-container">
        <header className="ai-header">
          <h1>
            <FontAwesomeIcon icon={faRobot} /> Groq AI Test
          </h1>
          <p>Test Groq AI integration with Du Lịch Văn Hoá Trinh database</p>
        </header>

        <div className="ai-chat">
          <div className="messages-section">
            {responses.length === 0 ? (
              <div className="empty-state">
                <p>
                  <FontAwesomeIcon icon={faComments} /> Chưa có cuộc trò chuyện
                  nào. Hãy bắt đầu bằng một câu hỏi!
                </p>
                <p className="examples">
                  <FontAwesomeIcon icon={faLightbulb} /> Ví dụ: "Gợi ý cho tôi
                  một tour du lịch", "Tôi muốn tìm một trải nghiệm thú vị"
                </p>
              </div>
            ) : (
              <div className="messages-list">
                {responses.map((item) => (
                  <div key={item.id} className="message-pair">
                    <div className="user-message">
                      <strong>Bạn:</strong>
                      <p>{item.question}</p>
                    </div>
                    <div className="ai-message">
                      <strong>
                        <FontAwesomeIcon icon={faRobot} /> Groq AI:
                      </strong>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="error-message">
                <FontAwesomeIcon icon={faCircleXmark} /> Lỗi: {error}
              </div>
            )}
            {loading && (
              <div className="loading-message">
                <FontAwesomeIcon icon={faHourglass} /> Đang xử lý...
              </div>
            )}
          </div>

          <div className="input-section">
            <textarea
              className="ai-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi để Groq AI trả lời..."
              disabled={loading}
              rows={3}
            />
            <div className="input-actions">
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim() || loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faHourglass} /> Đang gửi...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faWandMagicSparkles} /> Gửi
                  </>
                )}
              </button>

              {responses.length > 0 && (
                <button
                  className="clear-btn"
                  onClick={() => {
                    setResponses([]);
                    setMessage('');
                  }}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faRotateRight} /> Xóa tất cả
                </button>
              )}
            </div>
          </div>
        </div>

        <footer className="ai-footer">
          <p>
            Powered by{' '}
            <strong>
              Groq AI (llama-3.1-8b-instant) + Du Lịch Văn Hoá Trinh Database
            </strong>
          </p>
          <p>
            <small>
              <FontAwesomeIcon icon={faInfoCircle} /> Dữ liệu AI được tăng cường
              từ: Experiences, Tours, Artisans, Hotels
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AITestPage;
