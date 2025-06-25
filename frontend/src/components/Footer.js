import React from 'react';
import { Brain, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Github } from 'lucide-react';
import WellnessDisclaimer from './WellnessDisclaimer';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Demo', href: '#demo' },
      { name: 'API Access', href: '#' },
      { name: 'Mobile Apps', href: '#' }
    ],
    Company: [
      { name: 'About Us', href: '#founder' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    Resources: [
      { name: 'Blog', href: '#blog' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Wellness Studies', href: '#' },
      { name: 'Webinars', href: '#' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Data Security', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' }
  ];

  return (
    <footer className="bg-neutral-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Pre-footer CTA */}
        <div className="py-16 border-b border-neutral-800">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your 
              <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400"> Wellness Journey?</span>
            </h2>
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Join our early community and help us build the future of AI-powered wellness support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow"
                onClick={() => window.location.href = '/free-dashboard'}>
                Start Your Free Trial
              </button>
              <button className="border-2 border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:border-white/40 hover:bg-white/5"
                onClick={() => window.open('https://calendly.com/nithin-neuralyn', '_blank', 'noopener,noreferrer')}> 
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 py-16">
          {/* Brand & Contact */}
          <div>
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">HealMind AI</span>
            </div>
            <p className="text-neutral-300 mb-6">
              Making wellness support accessible, intelligent, and deeply human through the power of AI. 
              Personalized wellness guidance available 24/7 for stress management and personal growth.
              </p>
            <div className="flex flex-col gap-2 text-neutral-400 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:hello@neuralyn.health" className="hover:text-primary-400 transition-colors">hello@neuralyn.health</a>
                </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+13124091816" className="hover:text-primary-400 transition-colors">+1 312-409-1816</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Chicago, IL</span>
              </div>
            </div>
            {/* Socials placeholder */}
            <div className="flex gap-3 mt-2">
              {/* Social icons can be added here later */}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-6 text-white">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Wellness Disclaimer */}
        <div className="py-8 border-t border-neutral-800">
          <WellnessDisclaimer variant="footer" className="bg-neutral-800/50 border-neutral-700" />
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-neutral-400 mb-4 md:mb-0">
              <p>&copy; 2025 Neuralyn LLC. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap items-center space-x-6 text-sm text-neutral-400">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>All systems operational</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;