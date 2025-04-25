import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full md:w-4/12 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Medicare
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Plateforme de gestion de cabinet médical simple, intuitive et sécurisée.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a 
                href="#" 
                className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700"
                aria-aria-label="Twitter"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-2/12 mb-6 md:mb-0">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Navigation
              </h5>
              <ul className="list-none">
                <li className="mb-2">
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">
                    Tableau de bord
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/patients" className="text-sm text-gray-600 hover:text-indigo-600">
                    Patients
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/appointments" className="text-sm text-gray-600 hover:text-indigo-600">
                    Rendez-vous
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/medical-records" className="text-sm text-gray-600 hover:text-indigo-600">
                    Dossiers médicaux
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-2/12 mb-6 md:mb-0">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Aide
              </h5>
              <ul className="list-none">
                <li className="mb-2">
                  <Link to="/support" className="text-sm text-gray-600 hover:text-indigo-600">
                    Support
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/faq" className="text-sm text-gray-600 hover:text-indigo-600">
                    FAQ
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/terms" className="text-sm text-gray-600 hover:text-indigo-600">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-indigo-600">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-4/12">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                Contact
              </h5>
              <ul className="list-none">
                <li className="mb-2 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    123 Avenue de la Médecine, 75000 Paris
                  </span>
                </li>
                <li className="mb-2 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    contact@medicare.com
                  </span>
                </li>
                <li className="mb-2 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    +33 1 23 45 67 89
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-6 pt-6 text-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Medicare. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;