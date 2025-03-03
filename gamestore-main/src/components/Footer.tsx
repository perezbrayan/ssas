import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="bg-[#051923] text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">{t.home}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">{t.home}</Link></li>
              <li><Link to="/fortnite-shop" className="hover:text-primary-400 transition-colors">{t.fortnite}</Link></li>
              <li><Link to="/crew" className="hover:text-primary-400 transition-colors">{t.crew}</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">{t.contactUs}</h3>
            <ul className="space-y-2">
              <li><a href="mailto:info@gamestore.com" className="hover:text-primary-400 transition-colors">Email</a></li>
              <li><a href="tel:+1234567890" className="hover:text-primary-400 transition-colors">{t.contactUs}</a></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">{t.aboutUs}</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">{t.termsOfService}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">{t.privacyPolicy}</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">{t.followUs}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-facebook mr-2"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-instagram mr-2"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-twitter mr-2"></i> Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <i className="fab fa-cc-visa mr-2"></i> Visa
              </li>
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <i className="fab fa-cc-mastercard mr-2"></i> Mastercard
              </li>
              <li className="flex items-center justify-center md:justify-start text-gray-400">
                <i className="fab fa-cc-paypal mr-2"></i> PayPal
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} GameStore. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
