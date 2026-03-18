import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Info, 
  Mail, 
  HelpCircle, 
  FileText, 
  Shield, 
  MapPin, 
  Phone, 
  Mail as MailIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Rooms', path: '/rooms', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail }
  ];

  const supportLinks = [
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'Terms', path: '/terms', icon: FileText },
    { name: 'Privacy', path: '/privacy', icon: Shield }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  return (
    <section id="contact" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Mobile: Accordion-style sections, Desktop: Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SmartRoom
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Modern living spaces with smart technology for a better tomorrow. 
              Experience comfort, security, and convenience in every room.
            </p>
            
            {/* Social Links - Mobile Only */}
            <div className="flex items-center gap-3 sm:hidden">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Mobile Collapsible */}
     

    
          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <span>Darbhanga, Bihar 846004</span>
              </li>
              <li className="flex items-center gap-3">
                <MailIcon size={16} className="text-gray-400 flex-shrink-0" />
                <a href="mailto:contact@smartroom.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all">
                  contact@smartroom.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  +91 12345 67890
                </a>
              </li>
            </ul>

            {/* Social Links - Desktop Only */}
            <div className="hidden sm:flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

               <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <link.icon size={14} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    <span>{link.name}</span>
                    <ChevronRight size={12} className="opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

 

        {/* Newsletter Signup - Mobile Optimized */}
        

        {/* Bottom Bar */}
 
      </div>

      

      {/* Floating Back to Top Button - Mobile Only */}

    </section>
  );
};

export default Footer;