import React from 'react';
import Button from '../components/ui/Button';
import { Award, BookOpen, Clock, Star, Users, BarChart, MessageCircle, CalendarCheck, Trophy } from 'lucide-react';
import Gallery from '../components/sections/Gallery';
import ContactSection from '../components/sections/ContactSection';
import Check from '../components/ui/Check';
import { useCustomization } from '../hooks/useCustomization';
const HomePage: React.FC = () => {
  const { heroData } = useCustomization();

  return <div>
      {/* Hero Section - Now using dynamic data */}
      <section className="bg-primary py-20 sm:py-24 md:py-32 lg:py-40 relative" 
               style={heroData.backgroundImageUrl ? {
                 backgroundImage: `url(${heroData.backgroundImageUrl})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               } : {}}>
        {heroData.backgroundImageUrl && (
          <div className="absolute inset-0 bg-primary/80"></div>
        )}
        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:max-w-3xl text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 sm:mb-10">
                  {heroData.title}
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 mb-8">
                  {heroData.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-4 mt-6 sm:mt-8">
                  <Button variant="primary" size="lg" to="/register" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium shadow-lg w-full sm:w-auto">
                    Register Now
                  </Button>
                  <Button variant="outline" size="lg" to="/courses" className="border-white/30 bg-primary text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium w-full sm:w-auto">
                    Explore Courses
                  </Button>
                </div>
              </div>
              <div className="mt-8 md:mt-0">
                {heroData.imageUrl ? (
                  <img 
                    src={heroData.imageUrl} 
                    alt={heroData.title} 
                    className="h-24 sm:h-28 md:h-32 lg:h-40 w-auto rounded-lg shadow-lg" 
                  />
                ) : (
                  <img src="/image-removebg-preview.png" alt="Award Winning Academy" className="h-24 sm:h-28 md:h-32 lg:h-40 w-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Why Choose Shah Sultan's IELTS Academy
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto px-4 sm:px-0">
              At Shah Sultan's IELTS Academy, students receive more than just
              exam preparation—they gain confidence, practical skills, and
              personalized guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Expert-Led Classes
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Learn from dedicated educators with extensive experience in
                IELTS preparation and English language teaching.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Tailored Study Materials
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Access customized resources designed specifically for both
                Academic and General Training IELTS preparation.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Small Group Sessions
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Benefit from personalized attention in small classes that ensure
                your specific learning needs are addressed.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Computer-Based Practice
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Prepare for the digital IELTS format with our specialized
                computer-based practice sessions.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Mock Tests
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Build confidence through regular practice tests that simulate
                real exam conditions and provide detailed feedback.
              </p>
            </div>
            <div className="p-4 sm:p-6 bg-secondary rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Spoken English Support
              </h3>
              <p className="text-text-secondary text-sm sm:text-base">
                Develop confidence in your speaking skills through dedicated
                practice sessions and personalized feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 bg-secondary">
        <div className="container px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                About Shah Sultan's IELTS Academy
              </h2>
              <div>
                <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  Founded by dedicated educator Md. Shah Sultan, our academy
                  combines expert-led classes, hands-on practice, and tailored
                  study materials to ensure students are well-prepared for both
                  Academic and General Training IELTS.
                </p>
                <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  Our academy focuses on developing all four skills required for
                  IELTS success: listening, reading, writing, and speaking. With
                  small-group sessions, computer-based practice, mock tests, and
                  spoken English support, we've become a trusted name in Sylhet
                  for transforming learners' English proficiency into real
                  success.
                </p>
                <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  We take pride in our students' achievements - from beginners
                  building confidence in spoken English to advanced learners
                  securing band scores of 6.0–7.5. Our social media platforms
                  are filled with heartfelt testimonials from students who
                  reached their goals through our focused training.
                </p>
                <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  Over the years, we've gained recognition within the community
                  as one of Sylhet's leading IELTS training centers. The visit
                  of the British Council's Country Exams Director, Maxim
                  Raimann, reflects our growing prestige. With glowing reviews,
                  a 4.8/5 average rating, and a strong social media following of
                  over 29,000 people, we continue to stand out as a reliable,
                  results-driven institute.
                </p>
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">
                      5000+
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      Successful Students
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">
                      4.8/5
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      Average Rating
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">
                      29K+
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      Social Media Following
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">
                      7.5
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      Highest Band Score
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button variant="primary" to="/about" className="focus:ring-offset-secondary w-full sm:w-auto">
                  Learn More About Us
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img src="https://i.postimg.cc/SsvCP6tF/480479123-122187622418126286-254834324271260339-n.jpg" alt="Students studying at Shah Sultan's IELTS Academy" className="rounded-lg shadow-lg w-full h-auto object-cover" />
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-accent p-3 sm:p-4 rounded-lg shadow-lg">
                  <p className="text-white font-bold text-lg sm:text-xl">
                    British Council
                  </p>
                  <p className="text-white text-xs sm:text-sm">Recognized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Preview Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Our IELTS Preparation Courses
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Choose from our range of specialized courses designed to meet your
              specific needs and goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                <img src="https://i.postimg.cc/909RNv7Z/531659237-122207766008126286-7972825840697671255-n.jpg" alt="Academic IELTS Course" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    Academic
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
                  Academic IELTS
                </h3>
                <p className="text-text-secondary mb-4 text-sm sm:text-base">
                  Comprehensive preparation for the Academic IELTS exam, ideal
                  for university admissions.
                </p>
                <div className="flex items-center bg-accent/10 p-2 rounded-lg mb-4">
                  <span className="text-accent font-semibold">
                    ৳ 4,000 Taka
                  </span>
                </div>
                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      8-week intensive program
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      Academic writing tasks focus
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      4 full mock tests included
                    </span>
                  </li>
                </ul>
                <Button variant="outline" fullWidth to="/courses/academic">
                  View Details
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden relative">
                <img src="https://i.postimg.cc/8kf65r0c/531884297-122207766092126286-3499288174679764451-n.jpg" alt="General Training IELTS Course" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    General
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
                  General Training
                </h3>
                <p className="text-text-secondary mb-4 text-sm sm:text-base">
                  Focused preparation for the General Training IELTS exam for
                  migration or work.
                </p>
                <div className="flex items-center bg-accent/10 p-2 rounded-lg mb-4">
                  <span className="text-accent font-semibold">৳ 500 Taka</span>
                </div>
                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      6-week standard program
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      Letter writing & practical reading
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      3 full mock tests included
                    </span>
                  </li>
                </ul>
                <Button variant="outline" fullWidth to="/courses/general">
                  View Details
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ring-2 ring-accent">
              <div className="h-48 overflow-hidden relative">
                <img src="https://i.postimg.cc/SN0zzNBr/532862115-122207767376126286-1782722394302885862-n.jpg" alt="Fast Track IELTS Course" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                <div className="absolute inset-0 bg-accent/70 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    Fast Track
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  Most Popular
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary">
                  Fast Track Course
                </h3>
                <p className="text-text-secondary mb-4 text-sm sm:text-base">
                  Accelerated preparation for those with upcoming exam dates and
                  limited time.
                </p>
                <div className="flex items-center bg-accent/10 p-2 rounded-lg mb-4">
                  <span className="text-accent font-semibold">
                    Special Discount - Up to 25% Off
                  </span>
                </div>
                <ul className="space-y-2 mb-6 text-sm sm:text-base">
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      2-week intensive program
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      Daily mock tests and feedback
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-text-secondary text-sm">
                      One-on-one tutoring sessions
                    </span>
                  </li>
                </ul>
                <Button variant="primary" fullWidth to="/courses/fast-track">
                  Enroll Now
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Button variant="secondary" to="/courses">
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 bg-secondary relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-40 sm:w-64 h-40 sm:h-64 bg-primary opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-accent opacity-5 rounded-full"></div>
        <div className="container relative z-10 px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-accent font-medium px-3 sm:px-4 py-1 bg-accent/10 rounded-full mb-3 sm:mb-4 inline-block text-xs sm:text-sm">
              TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Success Stories
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
              From beginners building confidence to advanced learners securing
              band scores of 6.0–7.5, every success is celebrated at Shah
              Sultan's IELTS Academy.
            </p>
          </div>
          {/* Grid of testimonial cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Testimonial Card 1 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/K8xkJpv3/536268281-122208266720126286-7708938899969929883-n.jpg" alt="Sarah Johnson" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Sarah J.</p>
                  <p className="text-xs">Band Score: 7.0</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The structured approach and mock tests were exactly what I
                needed to succeed in my IELTS exam."
              </p>
            </div>
            {/* Testimonial Card 2 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/y8jJ5hkQ/536269114-122208451460126286-8178065957127452715-n.jpg" alt="Rahul Patel" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Rahul P.</p>
                  <p className="text-xs">Band Score: 6.5</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The speaking practice sessions gave me the confidence I needed.
                Highly recommend!"
              </p>
            </div>
            {/* Testimonial Card 3 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/9ff4j49W/537465075-122208847910126286-7760748678286341356-n.jpg" alt="Mina Chen" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Mina C.</p>
                  <p className="text-xs">Band Score: 7.5</p>
                </div>
              </div>
              <p className="text-sm italic">
                "Shah Sultan's personalized feedback on my writing tasks was
                invaluable for achieving my target score."
              </p>
            </div>
            {/* Testimonial Card 4 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/mr6PZb37/538260651-122208847982126286-601535625864210434-n.jpg" alt="Ahmed Hassan" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Ahmed H.</p>
                  <p className="text-xs">Band Score: 6.0</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The reading strategies I learned helped me improve my score
                from 5.5 to 6.0. Thank you!"
              </p>
            </div>
            {/* Testimonial Card 5 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/85Jjjqw9/538697568-122208847814126286-1506791474113233191-n.jpg" alt="Priya Singh" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Priya S.</p>
                  <p className="text-xs">Band Score: 6.5</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The fast-track program was perfect for my tight schedule. Got
                the score I needed for my visa application!"
              </p>
            </div>
            {/* Testimonial Card 6 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/xCwqHt4C/538764322-122208956384126286-2203106024956929594-n.jpg" alt="Michael Wong" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Michael W.</p>
                  <p className="text-xs">Band Score: 7.0</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The computer-based practice tests were excellent preparation
                for the actual exam format."
              </p>
            </div>
            {/* Testimonial Card 7 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/nrqr1By1/539247467-122208956534126286-4192278702647914682-n.jpg" alt="Sophia Martinez" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">Sophia M.</p>
                  <p className="text-xs">Band Score: 7.0</p>
                </div>
              </div>
              <p className="text-sm italic">
                "The small group size meant I got plenty of speaking practice.
                Worth every penny!"
              </p>
            </div>
            {/* Testimonial Card 8 */}
            <div className="bg-white border-2 border-primary p-3 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)]">
              <div className="relative mb-3 h-48 overflow-hidden">
                <img src="https://i.postimg.cc/G3D4rn4s/541765081-122209535678126286-7569929673749044973-n.jpg" alt="David Kim" className="object-cover w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white p-2">
                  <p className="font-bold text-sm">David K.</p>
                  <p className="text-xs">Band Score: 6.5</p>
                </div>
              </div>
              <p className="text-sm italic">
                "Shah Sultan's listening strategies helped me overcome my
                biggest challenge in the IELTS exam."
              </p>
            </div>
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <a href="/testimonials" className="inline-flex items-center text-primary font-medium hover:text-accent transition-colors text-sm sm:text-base">
              View more success stories
              <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Academy Gallery
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
              Take a look at our modern facilities, engaging classes, and
              student activities.
            </p>
          </div>
          <Gallery />
          <div className="text-center mt-6 sm:mt-8">
            <Button variant="outline" to="/gallery">
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 sm:py-16 bg-secondary">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Achievements & Recognition
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
              Over the years, we've gained recognition as one of Sylhet's
              leading IELTS training centers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Trophy className="h-6 w-6 text-accent mr-2" />
                British Council Recognition
              </h3>
              <p className="text-text-secondary mb-4">
                The visit of the British Council's Country Exams Director, Maxim
                Raimann, reflects our growing prestige in the IELTS preparation
                community.
              </p>
              <div className="flex items-center justify-center bg-secondary/30 rounded-lg p-4">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="British Council Visit" className="rounded-lg max-h-48" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="h-6 w-6 text-accent mr-2" />
                Community Impact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">4.8/5 Average Rating</p>
                    <p className="text-text-secondary text-sm">
                      Based on student feedback and reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      29,000+ Social Media Following
                    </p>
                    <p className="text-text-secondary text-sm">
                      Engaged community across Facebook and Instagram
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">High Success Rate</p>
                    <p className="text-text-secondary text-sm">
                      Most students achieve their target band scores
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <CalendarCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Leading Training Center</p>
                    <p className="text-text-secondary text-sm">
                      Recognized as one of Sylhet's top IELTS institutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-primary">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Achieve Your IELTS Goals?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8">
              Join Shah Sultan's IELTS Academy today and take the first step
              towards your international education or career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" to="/register" className="w-full sm:w-auto">
                Register Now
              </Button>
              <Button variant="outline" size="lg" to="/contact" className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </div>;
};
export default HomePage;