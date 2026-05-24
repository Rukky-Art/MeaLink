import { MapPin, Mail, Phone } from "lucide-react";
import logo from '../../assets/LandingPage/logo.svg'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Curved top decoration */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L1440 60L1440 20C1440 20 1200 0 720 0C240 0 0 20 0 20L0 60Z"
            fill="#006B4E"
          />
        </svg>
      </div>

      {/* Main footer */}
      <div className="bg-[#006B4E] text-white px-6 sm:px-10 lg:px-16 pb-6 -mt-px">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Brand / About */}
            <div className="sm:col-span-2 lg:col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={logo}
                  alt="MeaLink logo"
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span className="text-lg font-bold tracking-wide">
                  MeaLink
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/90 max-w-sm">
                Mealink is a food rescue platform. Every day, hotels and
                restaurants in various communities throw away tons of perfectly
                good food while thousands of people go hungry. MeaLink changes
                that: We're a digital bridge connecting food donors with
                verified nonprofit partners. Hotels post their surplus in 30
                seconds. NGOs claim it, pick it up, and feed communities that
                need it most.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 mt-5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <YoutubeIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <XIcon className="w-3 h-3" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Listings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Be a Partner
                  </a>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Cookie
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Terms of service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-sm text-white/90">
                    Eric Moore Road, Lagos Nigeria
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a
                    href="mailto:Mealink@gmail.com"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Mealink@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0" />
                  <a
                    href="tel:012-800-200"
                    className="text-sm text-white/90 hover:text-white transition-colors"
                  >
                    012-800-200
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider & copyright */}
          <div className="mt-10 pt-5 border-t border-white/20 text-center">
            <p className="text-sm text-white/80">All rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
