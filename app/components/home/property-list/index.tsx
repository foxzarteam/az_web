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
  
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const dragThreshold = 5; // Minimum pixels to consider it a drag

  // Calculate card width including gap
  const getCardWidth = () => {
    if (typeof window === 'undefined') return 300;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    const cardWidth = isMobile ? 280 : isTablet ? 320 : 340;
    const gap = isMobile ? 12 : isTablet ? 24 : 32;
    return cardWidth + gap;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't prevent if clicking on a link or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    
    setHasMoved(false);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
    
    // Pause animation
    if (carouselRef.current) {
      carouselRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't prevent if clicking on a link or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) {
      return;
    }
    
    setHasMoved(false);
    const touch = e.touches[0];
    setStartX(touch.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
    
    // Pause animation
    if (carouselRef.current) {
      carouselRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!carouselRef.current || startX === null) return;
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    const distance = Math.abs(x - startX);
    
    // Only consider it dragging if moved more than threshold
    if (distance > dragThreshold) {
      if (!isDragging) {
        setIsDragging(true);
      }
      e.preventDefault();
      setHasMoved(true);
      setDragOffset(walk);
      carouselRef.current.style.transform = `translateX(${walk}px)`;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current || startX === null) return;
    const touch = e.touches[0];
    const x = touch.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    const distance = Math.abs(x - startX);
    
    // Only consider it dragging if moved more than threshold
    if (distance > dragThreshold) {
      if (!isDragging) {
        setIsDragging(true);
      }
      e.preventDefault(); // Prevent scrolling
      setHasMoved(true);
      setDragOffset(walk);
      carouselRef.current.style.transform = `translateX(${walk}px)`;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // If we didn't move much, allow click to proceed
    if (!hasMoved && !isDragging) {
      if (carouselRef.current) {
        carouselRef.current.style.animationPlayState = 'running';
      }
      setStartX(null);
      return;
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setHasMoved(false);
    setStartX(null);
    
    // Resume animation
    if (carouselRef.current) {
      carouselRef.current.style.transform = '';
      carouselRef.current.style.animationPlayState = 'running';
    }
  };

  const handleTouchEnd = () => {
    // If we didn't move much, allow click to proceed
    if (!hasMoved && !isDragging) {
      if (carouselRef.current) {
        carouselRef.current.style.animationPlayState = 'running';
      }
      setStartX(null);
      return;
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setHasMoved(false);
    setStartX(null);
    
    // Resume animation
    if (carouselRef.current) {
      carouselRef.current.style.transform = '';
      carouselRef.current.style.animationPlayState = 'running';
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDragging || hasMoved || startX !== null) {
      setIsDragging(false);
      setDragOffset(0);
      setHasMoved(false);
      setStartX(null);
      if (carouselRef.current) {
        carouselRef.current.style.transform = '';
        carouselRef.current.style.animationPlayState = 'running';
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
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
          <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <div
              ref={carouselRef}
              className={`flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-max ${!isDragging ? 'animate-infinite-scroll' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                touchAction: isDragging ? 'none' : 'pan-x',
              }}
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
          </div>
        </div>
      </div>
    </section>
  );
}
