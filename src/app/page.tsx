'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState, useContext } from 'react';
import Image from 'next/image';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import VideoPlay from './components/home/homepage/VideoPlay';
import TabComponent from './components/home/homepage/TabComponent';
import { ParentContext } from './layout';
import ChatStep from './components/home/homepage/EarningsAssitant';
import CompaniesCarousel from './components/home/homepage/CompaniesCarousel';
import Footer from './components/home/homepage/Footer';


export default function LandingPage() {

  const { setIsLoginOpen } = useContext(ParentContext)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative m-8 flex flex-col items-center justify-center p-0">
      <div className="grid grid-rows-1 gap-4 min-h-full w-full bg-[#fff3ff] p-[60px] place-items-center">
        <div className='grid grid-cols-2 gap-4'>
          {/* Left Column */}
          <div className="flex flex-col justify-center text-center">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">


              Smarter Earnings Call Insights,<br />Powered by AI
            </h1>
            <p className="mt-4 text-lg font-regular text-gray-600">
              Decode earnings calls in seconds — no more endless transcripts
            </p>

            {/* Styled Button */}
            <Button
              onClick={() => setIsOpen(true)}
              className="
    group mt-6 rounded-full w-[20vw] max-w-[280px] py-6 px-6 text-white font-semibold
    bg-[#DA6486]
    shadow-lg shadow-purple-300/40
    transition-transform transform hover:scale-105 hover:shadow-xl hover:bg-[#E88FA7]
    flex items-center justify-center gap-2
  "
            >
              Explore Earnings Assistant
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 8 }} // Moves smoothly when hovered
                transition={{ type: 'spring', stiffness: 150, damping: 12 }}
                className="group-hover:translate-x-2"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </Button>

          </div>

          {/* Right Column */}
          <div className="relative w-full h-full flex justify-center items-center">
            <Image
              src="/images/heroim.png"
              alt="Happy employee"
              fill
              className="object-contain"
            />
          </div>

        </div>
        <ChatStep isOpen={isOpen} setIsOpen={setIsOpen} onExploreMore={() => setIsLoginOpen(true)}></ChatStep>

        <CompaniesCarousel></CompaniesCarousel>
      </div>
      <VideoPlay></VideoPlay>
      <TabComponent></TabComponent>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[60vh] mt-12 w-full bg-gradient-to-br from-[#fff3ff] to-[#fdeff9] p-8  shadow-lg items-center">
        {/* Left Part */}
        <div className="flex flex-col space-y-4">
          <p className="text-sm font-medium text-[#DA6486] tracking-wider uppercase">
            Subscribe
          </p>

          <h2
            className="text-4xl font-extrabold leading-tight
        bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500
        bg-clip-text text-transparent"
          >
            Stay updated with our latest marketing strategies
          </h2>

          <p className="text-base text-gray-600 leading-relaxed">
            Drop your email below to receive daily updates about what we do.
          </p>

          {/* Input and Button Container */}
          <div className="mt-4 w-full max-w-[500px]">
            <div className="flex items-center rounded-full overflow-hidden shadow-md border border-gray-300 focus-within:border-gray-300 transition-all">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 h-[48px] bg-white border-none outline-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 rounded-l-full"
              />
              <Button className="bg-[#DA6486] h-[48px] px-8 rounded-none rounded-r-full text-white font-medium hover:bg-[#E88FA7] transition-all">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Right Part */}
        <div className="relative w-full h-full flex justify-center items-center">
          <div className="relative w-full h-[280px]">
            <Image
              src="/images/heroim.png"
              alt="Happy employee"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
}


















