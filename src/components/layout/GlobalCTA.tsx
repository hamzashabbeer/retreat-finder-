import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GlobalCTA: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 skew-y-3"></div>
      <div className="relative max-w-7xl mx-auto px-4 text-center text-white py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
            Join thousands of others who have found their perfect retreat experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/retreats')}
              className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Retreats
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalCTA; 