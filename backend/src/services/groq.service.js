import Groq from 'groq-sdk';

class GroqService {
  constructor() {
    this.client = null;
  }

  /**
   * Khởi tạo Groq client lần đầu (Lazy initialization)
   */
  initializeClient() {
    if (this.client) return; // Đã khởi tạo rồi

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY không được cấu hình trong .env');
    }

    try {
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    } catch (e) {
      console.error('🔥 [initializeClient] Error:', e);
      throw e;
    }
  }

  /**
   * Tạo system prompt cho tư vấn du lịch
   */
  createSystemPrompt() {
    return `Bạn là tư vấn viên du lịch chuyên nghiệp của Van Hoá Trinh.

HƯỚNG DẪN:
- Chỉ tư vấn dựa trên dữ liệu được cung cấp
- Nếu khách hỏi về thứ không có trong dữ liệu, hãy nói "Xin lỗi, hiện chưa có thông tin về..."
- Trả lời thân thiện, ngắn gọn (3-5 dòng)
- Luôn gợi ý booking nếu phù hợp
- Nếu khách muốn booking, hãy bảo "Vui lòng liên hệ với admin qua chat hoặc gọi hotline"
- Sử dụng tiếng Việt`;
  }

  /**
   * Format dữ liệu từ DB thành context
   */
  formatDataContext(data) {
    let context = '';

    if (data.experiences && data.experiences.length > 0) {
      context += '\n📍 TRẢI NGHIỆM CÓ SẴN:\n';
      data.experiences.forEach((exp) => {
        context += `- ${exp.title} (${exp.category}): ${exp.description?.substring(0, 100)}... | Giá: ${exp.price}đ\n`;
      });
    }

    if (data.tours && data.tours.length > 0) {
      context += '\n🚌 TOUR DU LỊCH:\n';
      data.tours.forEach((tour) => {
        context += `- ${tour.name}: ${tour.description?.substring(0, 100)}... | Giá: ${tour.price}đ | Thời gian: ${tour.duration} ngày\n`;
      });
    }

    if (data.artisans && data.artisans.length > 0) {
      context += '\n👨‍🎨 NGHỆ NHÂN:\n';
      data.artisans.forEach((artisan) => {
        const name = artisan.userId
          ? `${artisan.userId.firstName} ${artisan.userId.lastName}`
          : 'Unknown';
        context += `- ${name} (${artisan.craft}): ${artisan.storytelling?.substring(0, 100)}...\n`;
      });
    }

    if (data.hotels && data.hotels.length > 0) {
      context += '\n🏨 KHÁCH SẠN:\n';
      data.hotels.forEach((hotel) => {
        context += `- ${hotel.name}: ${hotel.description?.substring(0, 100)}... | Giá: ${hotel.price}đ/đêm\n`;
      });
    }

    return context;
  }

  /**
   * Gọi Groq API với RAG
   * Sử dụng chat.completions API (OpenAI compatible)
   */
  async generateAdvice(userQuery, contextData) {
    try {
      // 🔧 Khởi tạo client nếu chưa (Lazy init)
      this.initializeClient();

      const systemPrompt = this.createSystemPrompt();
      const dataContext = this.formatDataContext(contextData);

      const fullPrompt = `${systemPrompt}

DỮ LIỆU HIỆN CÓ:${dataContext}

CÂUHỎI KHÁCH: "${userQuery}"

Hãy trả lời và gợi ý phù hợp:`;

      console.log('🔥 [generateAdvice] Calling Groq chat.completions API...');

      // Groq SDK sử dụng chat.completions (OpenAI compatible)
      const message = await this.client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: fullPrompt,
          },
          {
            role: 'user',
            content: userQuery,
          },
        ],
      });

      console.log('✅ Groq response received');
      const text = message.choices[0]?.message?.content || '';

      return {
        success: true,
        data: text,
        usage: {
          inputTokens: message.usage?.prompt_tokens || 0,
          outputTokens: message.usage?.completion_tokens || 0,
        },
      };
    } catch (error) {
      console.error('🔥 [generateAdvice] GROQ ERROR:', error?.message || error);
      console.error('🔥 [generateAdvice] FULL ERROR:', error);
      return {
        success: false,
        error: error?.message || 'Không thể gọi Groq API',
      };
    }
  }

  /**
   * Stream response từ Groq (nếu cần real-time)
   */
  async generateAdviceStream(userQuery, contextData) {
    try {
      // 🔧 Khởi tạo client nếu chưa (Lazy init)
      this.initializeClient();

      const systemPrompt = this.createSystemPrompt();
      const dataContext = this.formatDataContext(contextData);

      const fullPrompt = `${systemPrompt}

DỮ LIỆU HIỆN CÓ:${dataContext}

CÂUHỎI KHÁCH: "${userQuery}"

Hãy trả lời và gợi ý phù hợp:`;

      // Stream mode - sử dụng stream: true
      const stream = await this.client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1024,
        stream: true,
        messages: [
          {
            role: 'system',
            content: fullPrompt,
          },
          {
            role: 'user',
            content: userQuery,
          },
        ],
      });

      return stream;
    } catch (error) {
      console.error(
        '🔥 [generateAdviceStream] GROQ ERROR:',
        error?.message || error
      );
      console.error('🔥 [generateAdviceStream] FULL ERROR:', error);
      throw error;
    }
  }
}

export default new GroqService();
