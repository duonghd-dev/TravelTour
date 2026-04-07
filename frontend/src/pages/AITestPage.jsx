import React, { useState } from 'react';
import aiService from '@/services/api/aiService';
import './AITestPage.scss';

/**
 * AI Test Page
 * Simple page to test Groq AI integration
 */
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
          <h1>🤖 Groq AI Test</h1>
          <p>Test Groq AI integration with Du Lịch Văn Hoá Trinh database</p>
        </header>

        <div className="ai-chat">
          <div className="messages-section">
            {responses.length === 0 ? (
              <div className="empty-state">
                <p>
                  💬 Chưa có cuộc trò chuyện nào. Hãy bắt đầu bằng một câu hỏi!
                </p>
                <p className="examples">
                  💡 Ví dụ: "Gợi ý cho tôi một tour du lịch", "Tôi muốn tìm một
                  trải nghiệm thú vị"
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
                      <strong>🤖 Groq AI:</strong>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <div className="error-message">❌ Lỗi: {error}</div>}
            {loading && <div className="loading-message">⏳ Đang xử lý...</div>}
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
                {loading ? '⏳ Đang gửi...' : '✨ Gửi'}
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
                  🔄 Xóa tất cả
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
              ℹ️ Dữ liệu AI được tăng cường từ: Experiences, Tours, Artisans,
              Hotels
            </small>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AITestPage;
