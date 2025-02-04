import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-cover bg-center py-24" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")' }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Journey?</h2>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
          Join our community and discover transformative retreat experiences that align with your path.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/retreats')}
            className="px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Explore Retreats
          </button>
          <button 
            onClick={() => navigate('/auth/owner/signup')}
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
          >
            Become a Host
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 