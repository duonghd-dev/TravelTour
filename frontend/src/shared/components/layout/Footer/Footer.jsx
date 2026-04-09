import './Footer.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/Logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {}
          <div className="footer-column footer-brand">
            <Link to="/" className="footer-brand-link">
              <div className="footer-logo">
                <img
                  src={logo}
                  alt="Van Hoá Trinh Logo"
                  className="footer-logo-img"
                />
              </div>
              <h3 className="brand-name">Van Hoá Trinh</h3>
            </Link>
            <p className="brand-description">
              Chúng tôi tin rằng công nghệ không làm mất đi giá trị truyền
              thống, mà chính là cầu nối giúp đi sâu hơn vào tìm tìm hiểu trí.
            </p>
          </div>

          {}
          <div className="footer-column">
            <h4 className="footer-heading">HÀNH TRÌNH</h4>
            <ul className="footer-links">
              <li>
                <a href="#journey">Về Nghề nhân</a>
              </li>
              <li>
                <a href="#history">Lịch sử lăng nghề</a>
              </li>
              <li>
                <a href="#stories">Kể chuyện di sản</a>
              </li>
            </ul>
          </div>

          {}
          <div className="footer-column">
            <h4 className="footer-heading">LIÊN KẾT</h4>
            <ul className="footer-links">
              <li>
                <a href="#partnership">Hợp tác nghề nhân</a>
              </li>
              <li>
                <a href="#policy">Chính sách bảo tồn</a>
              </li>
              <li>
                <a href="#copyright">Bản quyền nội dung</a>
              </li>
            </ul>
          </div>

          {}
          <div className="footer-column">
            <h4 className="footer-heading">LIÊN HỆ</h4>
            <p className="contact-address">72 Nguyễn Sinh Sắc - Đà Nẵng</p>
            <p className="contact-phone">
              Hotline: <a href="tel:0702576978">0702576978</a>
            </p>
          </div>
        </div>

        {}
        <div className="footer-bottom">
          <p className="copyright">© 2026 VIỆT NAM HERITAGE PROJECT</p>
          <nav className="footer-legal-links">
            <a href="#privacy">PRIVACY POLICY</a>
            <span className="separator">|</span>
            <a href="#terms">TERMS OF SERVICE</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
