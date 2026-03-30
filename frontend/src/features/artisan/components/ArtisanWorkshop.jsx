import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ArtisanWorkshop.scss';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ArtisanWorkshop = ({ artisan }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!artisan || !artisan.workshopLocation || !mapContainer.current) return;

    const coordinates = artisan.location?.coordinates;
    const address = artisan.workshopLocation.address || '';

    // Mặc định Hà Nội nếu không có coordinates
    const lat = coordinates?.[1] || 21.0285;
    const lng = coordinates?.[0] || 105.8542;

    // Tạo map nếu chưa tồn tại
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([lat, lng], 15);

      // Thêm OpenStreetMap layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current);
    } else {
      // Cập nhật vị trí nếu map đã tồn tại
      map.current.setView([lat, lng], 15);
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer);
        }
      });
    }

    // Thêm marker
    const marker = L.marker([lat, lng])
      .addTo(map.current)
      .bindPopup(
        `<div><strong>${address || 'Workshop Location'}</strong></div>`
      )
      .openPopup();

    // Cleanup: không xóa map khi component unmount vì có thể tái sử dụng
    return () => {
      // Optional: remove marker on cleanup
    };
  }, [artisan]);

  if (!artisan || !artisan.workshopLocation) return null;

  const address = artisan.workshopLocation.address || '';

  return (
    <section className="artisan-workshop">
      <div className="artisan-workshop__container">
        <h2 className="artisan-workshop__title">The Workshop</h2>

        <div className="artisan-workshop__content">
          <div className="artisan-workshop__map">
            <div
              className="artisan-workshop__map-placeholder"
              ref={mapContainer}
              style={{
                minHeight: '400px',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            ></div>
            {address && (
              <div className="artisan-workshop__location-pin">📍 {address}</div>
            )}
          </div>

          <div className="artisan-workshop__info">
            <h3 className="artisan-workshop__section-title">Địa Chỉ</h3>
            <p className="artisan-workshop__address">
              {address || 'Chưa cập nhật'}
            </p>

            <h3 className="artisan-workshop__section-title">Lịch Hoạt Động</h3>
            <div
              className="artisan-workshop__schedule"
              dangerouslySetInnerHTML={{
                __html:
                  artisan.workshopLocation.description ||
                  artisan.schedule ||
                  '<p>Liên hệ để biết lịch hoạt động chi tiết</p>',
              }}
            />

            {address && (
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="artisan-workshop__btn"
              >
                Get Directions
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtisanWorkshop;
