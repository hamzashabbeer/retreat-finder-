import React from 'react';
import { Check, Users, Globe, Star, Heart, Shield, Sparkle } from 'lucide-react';
import { motion } from 'framer-motion';
import CallToAction from '../components/layout/CallToAction';

const About: React.FC = () => {
  const stats = [
    { 
      number: '50,000+', 
      label: 'Trusted by Seekers', 
      icon: Users,
      description: 'People who found their perfect retreat through us'
    },
    { 
      number: '100+', 
      label: 'Global Locations', 
      icon: Globe,
      description: 'Destinations across the world offering transformative experiences'
    },
    { 
      number: '4.9/5', 
      label: 'Customer Rating', 
      icon: Star,
      description: 'Based on thousands of verified reviews'
    },
    { 
      number: '95%', 
      label: 'Satisfaction Rate', 
      icon: Heart,
      description: 'Of our customers recommend FindRetreat to friends'
    }
  ];

  const features = [
    {
      icon: Check,
      title: 'Best Price Guarantee',
      description: 'We match any price you find elsewhere, ensuring you get the best value.',
      color: 'bg-emerald-500'
    },
    {
      icon: Shield,
      title: 'Verified Retreats',
      description: 'Every retreat is personally vetted for quality and authenticity.',
      color: 'bg-blue-500'
    },
    {
      icon: Sparkle,
      title: 'Personalized Experience',
      description: 'Custom recommendations based on your preferences and goals.',
      color: 'bg-purple-500'
    }
  ];

  const values = [
    {
      title: 'Authenticity',
      description: 'We carefully verify each retreat and host to ensure genuine, transformative experiences.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Mindfulness',
      description: 'Every retreat is designed to promote personal growth and inner peace.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Community',
      description: 'We foster connections between like-minded individuals seeking wellness.',
      image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const team = [
    {
      name: 'Sarah Anderson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'Former yoga instructor turned entrepreneur, passionate about making wellness accessible to everyone.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Retreat Relations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'With 10+ years in wellness tourism, Michael ensures the highest quality retreat experiences.'
    },
    {
      name: 'Emma Thompson',
      role: 'Community Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'Dedicated to fostering meaningful connections within our global wellness community.'
    }
  ];

  const milestones = [
    {
      year: '2016',
      title: 'The Beginning',
      description: 'FindRetreat was founded with a vision to transform lives through mindful experiences.'
    },
    {
      year: '2018',
      title: 'Global Expansion',
      description: 'Expanded to 50+ countries, connecting seekers with authentic retreat experiences worldwide.'
    },
    {
      year: '2020',
      title: 'Digital Evolution',
      description: 'Launched virtual retreats, making wellness accessible during global challenges.'
    },
    {
      year: '2023',
      title: 'Community Growth',
      description: 'Reached 50,000+ satisfied customers and 1,000+ verified retreat hosts.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Meditation retreat"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <motion.div 
          className="relative text-center text-white max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            Transforming Lives Through
            <span className="block text-blue-400">Mindful Experiences</span>
          </h1>
          <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
            Since 2016, we've been connecting seekers with life-changing retreat experiences.
            Our mission is to make wellness and personal growth accessible to everyone.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Our Mission"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-600 rounded-2xl -z-10"></div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-3 mb-3">
                <div className="h-[1px] w-12 bg-blue-600/30"></div>
                <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Connecting People to Life-Changing Experiences</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At FindRetreat, we believe that everyone deserves access to transformative wellness experiences. 
                Our platform connects mindful travelers with authentic retreat hosts, creating a community 
                dedicated to personal growth and inner peace.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-lg font-medium text-gray-800 mb-2">{stat.label}</p>
                <p className="text-gray-600">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to a global wellness platform, here's how we've grown.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <span className="text-blue-600 font-bold text-xl">{milestone.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-2">{milestone.title}</h3>
                      <p className="text-gray-600 mt-2">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind FindRetreat who make transformative experiences possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose FindRetreat</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best retreat booking experience possible,
              backed by our guarantees and world-class support.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`absolute -top-6 left-8 w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what people are saying about their FindRetreat experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={`https://i.pravatar.cc/150?img=${index + 1}`}
                      alt="User avatar"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">Sarah Johnson</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "FindRetreat made it so easy to find and book my perfect meditation retreat.
                  The experience was transformative and exactly what I needed."
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
};

export default About; 