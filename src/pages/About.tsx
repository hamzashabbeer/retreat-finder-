import React from 'react';
import { Check, Users, Globe, Star } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Verified Retreats', icon: Check },
    { number: '50k+', label: 'Happy Customers', icon: Users },
    { number: '100+', label: 'Locations', icon: Globe },
    { number: '4.9', label: 'Average Rating', icon: Star },
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
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Passionate about making wellness accessible to everyone.'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Experiences',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Expert in curating transformative retreat experiences.'
    },
    {
      name: 'Emma Williams',
      role: 'Community Director',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Building bridges between retreat hosts and seekers.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Meditation retreat"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Transforming Lives Through Mindful Experiences</h1>
          <p className="text-xl text-gray-200">
            Discover the story behind FindRetreat and our mission to make wellness accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Our Mission"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-blue-600 rounded-2xl -z-10"></div>
              </div>
            </div>
            <div className="space-y-6">
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
              <div className="pt-6">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  Learn More About Our Vision
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
              <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">Our Values</span>
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Stand For</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our values guide everything we do, from selecting retreat hosts to supporting our community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48">
                  <img src={value.image} alt={value.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
              <span className="text-blue-600 font-medium text-sm tracking-wider uppercase">Our Team</span>
              <div className="h-[1px] w-12 bg-blue-600/30"></div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet the Minds Behind FindRetreat</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise in wellness, technology, and community building.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-blue-600 transform scale-110"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-blue-600 mb-3">{member.role}</div>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Join our community and discover transformative retreat experiences that align with your path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
              Explore Retreats
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-200">
              Become a Host
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 