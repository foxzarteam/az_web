"use client";

import { useState, useRef, useEffect } from "react";
import FeaturedCard from "./featured-card";
import { FEATURED_SERVICES } from "@/app/config/constants";

// Image files should exist in public/images/service
// Order must match FEATURED_SERVICES:
// [Home Loan, Personal Loan, Business Loan, Credit Card, Insurance]
const SERVICE_IMAGES: string[] = [
  "/images/service/home.png",      // Home Loan
  "/images/service/personal.png",  // Personal Loan
  "/images/service/business.png",  // Business Loan
  "/images/service/credit.png",    // Credit Card
  "/images/service/insurance.png", // Insurance
];

const SERVICE_LINKS: string[] = [
  "/services/home-loan",
  "/services/personal-loan",
  "/services/business-loan",
  "/services/credit-card",
  "/services/insurance",
];

export default function Listing() {
  const cards = FEATURED_SERVICES.map((item, i) => ({
    ...item,
    image: SERVICE_IMAGES[i] || "",
    href: SERVICE_LINKS[i] || "/#featured",
  }));
  // 4 copies for seamless infinite loop (animation scrolls -25% so reset is invisible)
  const infiniteCards = [...cards, ...cards, ...cards, ...cards];
  
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const manualOffsetRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Calculate card width including gap
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 300;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const cardWidth = isMobile ? 280 : isTablet ? 320 : 340;
    const gap = isMobile ? 12 : isTablet ? 24 : 32;
    return cardWidth + gap;
  };

  // Calculate total width of one set of cards (25% of total)
  const getOneSetWidth = () => {
    const cardWidth = getCardWidth();
    return cardWidth * cards.length; // One set = 5 cards
  };

  const slideLeft = () => {
    if (!carouselRef.current || isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    
    // Remove animation class to stop CSS animation
    setIsPaused(true);
    carouselRef.current.classList.remove('animate-infinite-scroll');
    
    // Get current transform
    const computedStyle = window.getComputedStyle(carouselRef.current);
    const currentTransform = computedStyle.transform;
    let currentX = 0;
    
    // Parse current X position
    if (currentTransform && currentTransform !== 'none') {
      const matrixMatch = currentTransform.match(/matrix\(([^)]+)\)/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',');
        if (values.length >= 5) {
          currentX = parseFloat(values[4].trim()) || 0;
        }
      }
    }
    
    // Calculate new position
    const cardWidth = getCardWidth();
    const oneSetWidth = getOneSetWidth();
    let newX = currentX - cardWidth;
    
    // Infinite loop: if we go beyond one set, reset seamlessly
    if (newX <= -oneSetWidth) {
      // Reset to equivalent position in the next set (seamless - no transition)
      newX = newX + oneSetWidth;
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(${newX}px)`;
      // Force reflow to apply the reset
      void carouselRef.current.offsetHeight;
      // Now continue with normal transition
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
          const finalX = newX - cardWidth;
          carouselRef.current.style.transform = `translateX(${finalX}px)`;
          manualOffsetRef.current = finalX;
          
          // Mark transition as complete after animation
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 500);
          
          // Resume animation after 3 seconds of inactivity
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }
          animationTimeoutRef.current = setTimeout(() => {
            if (carouselRef.current && !isTransitioningRef.current) {
              carouselRef.current.style.transition = '';
              carouselRef.current.style.transform = '';
              carouselRef.current.classList.add('animate-infinite-scroll');
              setIsPaused(false);
              manualOffsetRef.current = 0;
            }
          }, 3000);
        }
      }, 10);
      return; // Early return, timeout handles the rest
    }
    
    // Normal slide
    carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
    carouselRef.current.style.transform = `translateX(${newX}px)`;
    manualOffsetRef.current = newX;
    
    // Mark transition as complete after animation
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
    
    // Resume animation after 3 seconds of inactivity
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      if (carouselRef.current && !isTransitioningRef.current) {
        carouselRef.current.style.transition = '';
        carouselRef.current.style.transform = '';
        carouselRef.current.classList.add('animate-infinite-scroll');
        setIsPaused(false);
        manualOffsetRef.current = 0;
      }
    }, 3000);
  };

  const slideRight = () => {
    if (!carouselRef.current || isTransitioningRef.current) return;
    
    isTransitioningRef.current = true;
    
    // Remove animation class to stop CSS animation
    setIsPaused(true);
    carouselRef.current.classList.remove('animate-infinite-scroll');
    
    // Get current transform
    const computedStyle = window.getComputedStyle(carouselRef.current);
    const currentTransform = computedStyle.transform;
    let currentX = 0;
    
    // Parse current X position
    if (currentTransform && currentTransform !== 'none') {
      const matrixMatch = currentTransform.match(/matrix\(([^)]+)\)/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',');
        if (values.length >= 5) {
          currentX = parseFloat(values[4].trim()) || 0;
        }
      }
    }
    
    // Calculate new position
    const cardWidth = getCardWidth();
    const oneSetWidth = getOneSetWidth();
    let newX = currentX + cardWidth;
    
    // Infinite loop: if we go beyond start, reset seamlessly
    if (newX >= 0) {
      // Reset to equivalent position in the previous set (seamless - no transition)
      newX = newX - oneSetWidth;
      carouselRef.current.style.transition = 'none';
      carouselRef.current.style.transform = `translateX(${newX}px)`;
      // Force reflow to apply the reset
      void carouselRef.current.offsetHeight;
      // Now continue with normal transition
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
          const finalX = newX + cardWidth;
          carouselRef.current.style.transform = `translateX(${finalX}px)`;
          manualOffsetRef.current = finalX;
          
          // Mark transition as complete after animation
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 500);
          
          // Resume animation after 3 seconds of inactivity
          if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
          }
          animationTimeoutRef.current = setTimeout(() => {
            if (carouselRef.current && !isTransitioningRef.current) {
              carouselRef.current.style.transition = '';
              carouselRef.current.style.transform = '';
              carouselRef.current.classList.add('animate-infinite-scroll');
              setIsPaused(false);
              manualOffsetRef.current = 0;
            }
          }, 3000);
        }
      }, 10);
      return; // Early return, timeout handles the rest
    }
    
    // Normal slide
    carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
    carouselRef.current.style.transform = `translateX(${newX}px)`;
    manualOffsetRef.current = newX;
    
    // Mark transition as complete after animation
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 500);
    
    // Resume animation after 3 seconds of inactivity
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animationTimeoutRef.current = setTimeout(() => {
      if (carouselRef.current && !isTransitioningRef.current) {
        carouselRef.current.style.transition = '';
        carouselRef.current.style.transform = '';
        carouselRef.current.classList.add('animate-infinite-scroll');
        setIsPaused(false);
        manualOffsetRef.current = 0;
      }
    }, 3000);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section id="featured" className="bg-light dark:bg-semidark flex justify-center items-center overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 md:mb-12 text-midnight_text dark:text-white text-center" data-aos="fade-up">
          Our Services
        </h1>
        <div className="relative -mx-4 sm:mx-0">
          <div className="overflow-hidden relative">
            <div
              ref={carouselRef}
              className={`flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-max ${!isPaused ? 'animate-infinite-scroll' : ''}`}
            >
              {infiniteCards.map((card, index) => (
                <div
                  key={index}
                  className="shrink-0 w-[260px] xs:w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px]"
                >
                  <FeaturedCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    href={card.href}
                  />
                </div>
              ))}
            </div>
            
            {/* Navigation Arrows - Desktop: Vertical Center at Corners */}
            {/* Left Arrow - Desktop: Left Corner */}
            <button
              onClick={slideLeft}
              aria-label="Previous"
              className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl group z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Right Arrow - Desktop: Right Corner */}
            <button
              onClick={slideRight}
              aria-label="Next"
              className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl group z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation Arrows - Mobile: Bottom */}
        <div className="flex justify-center items-center gap-3 mt-6 sm:mt-8 md:hidden">
          <button
            onClick={slideLeft}
            aria-label="Previous"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={slideRight}
            aria-label="Next"
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-darklight border border-gray-200 dark:border-gray-700 hover:bg-primary hover:border-primary hover:text-white text-gray-600 dark:text-gray-300 transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
