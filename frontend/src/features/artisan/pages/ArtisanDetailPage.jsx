import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useToast } from '@/contexts';
import { MessageButton } from '@/features/chat/components';
import './ArtisanDetailPage.scss';

const ArtisanDetailPage = () => {
  const { artisanId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArtisanDetail();
  }, [artisanId]);

  const loadArtisanDetail = async () => {
    try {
      setLoading(true);
      // TODO: Replace với API call thực tế
      // const response = await artisanApi.getArtisanDetail(artisanId);

      // Mock data for now
      const mockArtisan = {
        _id: artisanId,
        firstName: 'Van Hoa',
        lastName: 'Trinh',
        email: 'trinh@example.com',
        phone: '2312313413213',
        avatar: 'https://via.placeholder.com/200',
        role: 'artisan',
        craftCategory: 'Traditional Crafts',
        bio: 'Experienced artisan in traditional Vietnamese crafts',
        location: 'Vietnam',
        experience: '20+ years',
        ratingCount: 22,
        rating: 4.8,
        description: `Many traditional craft villages are disappearing. The last artisans keep the flame alive, 
but the younger generation is not eager to continue the heritage. When culture becomes only a memory, 
millions visit Vietnam and must experience the authentic culture preserved by these masters.`,
        experiences: [
          { id: 1, title: 'Experience 1', price: 500000 },
          { id: 2, title: 'Experience 2', price: 750000 },
        ],
      };

      setArtisan(mockArtisan);
    } catch (err) {
      setError(err.message);
      toast.error('Không thể tải thông tin artisan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="artisan-detail loading">Đang tải...</div>;
  }

  if (error || !artisan) {
    return (
      <div className="artisan-detail error">
        <p>{error || 'Không tìm thấy artisan'}</p>
        <button onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div className="artisan-detail">
      <div className="artisan-detail__header">
        <div className="artisan-detail__cover">
          <img
            src="https://via.placeholder.com/800x300"
            alt={`${artisan.firstName} ${artisan.lastName}`}
          />
        </div>

        <div className="artisan-detail__info">
          <div className="artisan-detail__avatar">
            <img src={artisan.avatar} alt={artisan.firstName} />
          </div>

          <div className="artisan-detail__basic">
            <h1 className="artisan-detail__name">
              {artisan.firstName} {artisan.lastName}
            </h1>
            <p className="artisan-detail__craft">{artisan.craftCategory}</p>
            <p className="artisan-detail__location">📍 {artisan.location}</p>

            <div className="artisan-detail__rating">
              <span className="stars">⭐ {artisan.rating}</span>
              <span className="count">({artisan.ratingCount} reviews)</span>
            </div>

            <div className="artisan-detail__actions">
              {user && user._id !== artisan._id ? (
                <>
                  <MessageButton
                    userId={artisan._id}
                    userName={`${artisan.firstName} ${artisan.lastName}`}
                    variant="primary"
                  >
                    💬 Nhắn tin
                  </MessageButton>

                  <button className="artisan-detail__btn artisan-detail__btn--secondary">
                    ❤️ Yêu thích
                  </button>
                </>
              ) : user ? (
                <p className="artisan-detail__self">
                  Đây là trang profile của bạn
                </p>
              ) : (
                <button
                  className="artisan-detail__btn artisan-detail__btn--primary"
                  onClick={() => navigate('/login')}
                >
                  Đăng nhập để nhắn tin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="artisan-detail__content">
        {/* Bio Section */}
        <section className="artisan-detail__section">
          <h2>Về tôi</h2>
          <p className="artisan-detail__bio">{artisan.description}</p>
        </section>

        {/* Contact Info */}
        <section className="artisan-detail__section">
          <h2>Thông tin liên hệ</h2>
          <div className="artisan-detail__contact">
            <div className="contact-item">
              <span className="label">Email:</span>
              <span className="value">{artisan.email}</span>
            </div>
            <div className="contact-item">
              <span className="label">Điện thoại:</span>
              <span className="value">{artisan.phone}</span>
            </div>
            <div className="contact-item">
              <span className="label">Địa điểm:</span>
              <span className="value">{artisan.location}</span>
            </div>
          </div>
        </section>

        {/* Experiences */}
        {artisan.experiences && artisan.experiences.length > 0 && (
          <section className="artisan-detail__section">
            <h2>Các trải nghiệm</h2>
            <div className="artisan-detail__experiences">
              {artisan.experiences.map((exp) => (
                <div key={exp.id} className="experience-card">
                  <h3>{exp.title}</h3>
                  <p className="price">{exp.price.toLocaleString()} VND</p>
                  <button className="btn-book">Đặt lịch</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtisanDetailPage;
