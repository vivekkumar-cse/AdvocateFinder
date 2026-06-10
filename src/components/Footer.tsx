import { Scale, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">AdvocateFinder</h3>
                <p className="text-xs text-primary-foreground/60">Find Legal Help</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              A conceptual prototype for discovering legal advocates by location and specialization.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/advocates" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  Find Advocates
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Advocates */}
          <div>
            <h4 className="font-semibold mb-4">For Advocates</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-primary-foreground/70 hover:text-secondary transition-colors cursor-pointer">
                  Register Profile
                </span>
              </li>
              <li>
                <span className="text-primary-foreground/70 hover:text-secondary transition-colors cursor-pointer">
                  Verification Process
                </span>
              </li>
              <li>
                <span className="text-primary-foreground/70 hover:text-secondary transition-colors cursor-pointer">
                  Guidelines
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4" />
                <span>support@advocatefinder.demo</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4" />
                <span>+91 1234 567 890</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                <span>Demo Location, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/10">
          <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-center text-primary-foreground/90">
              ⚠️ <strong>Important Disclaimer:</strong> This is a conceptual prototype designed for learning and demonstration purposes only. 
              It is NOT a real legal service and does NOT provide legal advice. All data shown is mock/seeded data.
            </p>
          </div>
          <p className="text-center text-sm text-primary-foreground/50">
            © 2025 AdvocateFinder. Built for educational purposes! Created by 侍
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
