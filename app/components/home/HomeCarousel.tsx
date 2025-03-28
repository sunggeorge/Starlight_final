'use client';

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Image from 'next/image';

// Create four variables
interface HomeCarouselProps {
  loop?: boolean;
  initial?: number;
  autoPlay?: boolean;
  autoPlayTimeout?: number;
}

const HomeCarousel: React.FC<HomeCarouselProps> = ({
  loop = true,
  initial = 0,
  autoPlay = true,
  autoPlayTimeout = 3500,
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: loop,
      initial: initial,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [(slider) => setAutoPlay(slider, autoPlay)],
  );

  const setAutoPlay = (slider: any, autoPlay: boolean) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, autoPlayTimeout);
    }
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false;
        autoPlay ? nextTimeout() : clearNextTimeout();
      });
      autoPlay ? nextTimeout() : clearNextTimeout();
    });
    slider.on('dragStarted', clearNextTimeout);
    slider.on('animationEnded', autoPlay ? nextTimeout : clearNextTimeout);
    slider.on('updated', autoPlay ? nextTimeout : clearNextTimeout);
  };

  const slidesLengthKeys = Array.from(
    { length: instanceRef && instanceRef.current ? instanceRef.current.track.details.slides.length : 0 },
    (_, index) => index,
  );

  return (
    <div className="home-slider relative flex w-full h-[450px] sm:h-[550px] mb-2 sm:mb-4">
      <div ref={sliderRef} className="keen-slider">
        <div className="keen-slider__slide min-w-[100%] w-full flex items-center justify-center max-h-screen p-4">
          <div className="relative flex w-full h-full rounded-badge bg-gradient-to-r from-primary to-primary/30">
            <div className="flex flex-wrap w-full">
              <div className="relative flex flex-col items-center justify-center gap-2 p-2 h-[50%] sm:h-full sm:gap-6 sm:p-6 z-10 w-full sm:w-5/12">
                <h3 className="text-white text-3xl sm:text-5xl font-semibold">Beauty Empowered</h3>
                <p className="text-white text-lg sm:text-2xl font-semibold">Where Style Meets Precision</p>
                <p className="text-white text-xs sm:text-sm font-light">
                Feel confident with every fingertip — crafted with care by professionals.
                </p>
              </div>
              <div className="relative w-full h-[50%] sm:h-full sm:w-7/12">
                <Image
                  className="max-h-full w-auto absolute bottom-0 left-[50%] translate-x-[-50%] sm:bottom-0 sm:left-[100%] sm:translate-x-[-100%]"
                  // src="/images/discount-people-1.png"
                  src="/images/1.jpg"
                  alt="Beauty Empowered"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="keen-slider__slide min-w-[100%] w-full flex items-center justify-center max-h-screen p-4">
          <div className="relative flex w-full h-full rounded-badge bg-gradient-to-r from-yellow-300 to-yellow-300/30">
            <div className="flex flex-wrap w-full">
              <div className="relative flex flex-col items-center justify-center gap-2 p-2 h-[50%] sm:h-full sm:gap-6 sm:p-6 z-10 w-full sm:w-5/12">
                <h3 className="text-white text-3xl sm:text-5xl font-semibold">Nails That Speak</h3>
                <p className="text-white text-lg sm:text-2xl font-semibold">Art on Every Tip</p>
                <p className="text-white text-xs sm:text-sm font-light">
                Express your personality with bold, elegant, or playful nail designs.
                </p>
              </div>
              <div className="relative w-full h-[50%] sm:h-full sm:w-7/12">
                <Image
                  className="max-h-full w-auto absolute bottom-0 left-[50%] translate-x-[-50%] sm:bottom-0 sm:left-[100%] sm:translate-x-[-100%]"
                  // src="/images/discount-people-2.png"
                  src="/images/2.jpg"
                  alt="Nails That Speak"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="keen-slider__slide min-w-[100%] w-full flex items-center justify-center max-h-screen p-4">
          <div className="relative flex w-full h-full rounded-badge bg-gradient-to-r from-orange-400 to-orange-400/30">
            <div className="flex flex-wrap w-full">
              <div className="relative flex flex-col items-center justify-center gap-2 p-2 h-[50%] sm:h-full sm:gap-6 sm:p-6 z-10 w-full sm:w-5/12">
                <h3 className="text-white text-3xl sm:text-5xl font-semibold">Shine Every Day</h3>
                <p className="text-white text-lg sm:text-2xl font-semibold">Simple. Clean. Stunning.</p>
                <p className="text-white text-xs sm:text-sm font-light">
                A fresh set of nails makes everything feel better — you deserve it.
                </p>
              </div>
              <div className="relative w-full h-[50%] sm:h-full sm:w-7/12">
                <Image
                  className="max-h-full w-auto absolute bottom-0 left-[50%] translate-x-[-50%] sm:bottom-0 sm:left-[100%] sm:translate-x-[-100%]"
                  // src="/images/discount-people-3.png"
                  src="/images/3.jpg"
                  alt="Shine Every Day"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="keen-slider__slide min-w-[100%] w-full flex items-center justify-center max-h-screen p-4">
          <div className="relative flex w-full h-full rounded-badge bg-gradient-to-r from-blue-400 to-blue-400/30">
            <div className="flex flex-wrap w-full">
              <div className="relative flex flex-col items-center justify-center gap-2 p-2 h-[50%] sm:h-full sm:gap-6 sm:p-6 z-10 w-full sm:w-5/12">
                <h3 className="text-white text-3xl sm:text-5xl font-semibold">Crafted by Artists</h3>
                <p className="text-white text-lg sm:text-2xl font-semibold">Not Just Nails — It is Art</p>
                <p className="text-white text-xs sm:text-sm font-light">
                Every set is a canvas. Every stroke, a statement.
                </p>
              </div>
              <div className="relative w-full h-[50%] sm:h-full sm:w-7/12">
                <Image
                  className="max-h-full w-auto absolute bottom-0 left-[50%] translate-x-[-50%] sm:bottom-0 sm:left-[100%] sm:translate-x-[-100%]"
                  // src="/images/discount-people-4.png"
                  src="/images/4.jpg"
                  alt="Crafted by Artists"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {loaded && instanceRef.current && (
        <div className="dots absolute w-full z-10 flex items-center justify-center bottom-[30px]">
          {}
          {slidesLengthKeys.map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                className={
                  'btn btn-xs w-[15px] h-[15px] min-h-[15px] btn-circle mx-1 ' +
                  (currentSlide === idx ? ' btn-primary active' : 'btn-white')
                }
              ></button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeCarousel;
