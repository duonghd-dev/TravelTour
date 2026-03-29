import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useToast } from '@/contexts';
import {
  ArtisanHeader,
  ArtisanBio,
  ArtisanWorkshop,
  ArtisanPortfolio,
  ArtisanExperiences,
  ArtisanReviews,
} from '../components';
import { artisanApi } from '../api/artisanApi';
import './ArtisanDetailPage.scss';

const ArtisanDetailPage = () => {
  const { id: artisanId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [artisan, setArtisan] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArtisanDetail();
  }, [artisanId]);

  const loadArtisanDetail = async () => {
    try {
      setLoading(true);
      const response = await artisanApi.getArtisanDetail(artisanId);

      if (response.success) {
        setArtisan(response.data);
        setExperiences(response.data.experiences || []);
      } else {
        setError(response.message || 'Không thể tải thông tin artisan');
      }
    } catch (err) {
      const errorMsg = err.message || 'Lỗi khi tải thông tin artisan';
      setError(errorMsg);
      toast?.error?.(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="artisan-detail artisan-detail--loading">
        <div className="artisan-detail__spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="artisan-detail artisan-detail--error">
        <div className="artisan-detail__error-content">
          <h2>Không tìm thấy nghệ nhân</h2>
          <p>{error || 'Vui lòng thử lại sau'}</p>
          <button
            className="artisan-detail__btn-back"
            onClick={() => navigate(-1)}
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="artisan-detail">
      <ArtisanHeader artisan={artisan} user={user} />
      <ArtisanBio artisan={artisan} />
      <ArtisanWorkshop artisan={artisan} />
      <ArtisanPortfolio artisan={artisan} />
      <ArtisanExperiences experiences={experiences} />
      <ArtisanReviews reviews={[]} ratingAverage={artisan.ratingAverage || 0} />
    </div>
  );
};

export default ArtisanDetailPage;
