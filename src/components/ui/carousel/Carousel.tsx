"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type TProps = {
    slides: {id: string; image: string; title: string; description: string}[]
}

const Carousel = ({slides}: TProps) => {

  return (
    <div className="">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="rounded-lg overflow-hidden"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[300px] w-full md:h-full">
              <div className="h-full flex justify-center items-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover"
                  />
              </div>

              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                <p className="text-sm opacity-90">{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* Customização para alinhar com o tema TailAdmin/Slim */
        .swiper-button-next, .swiper-button-prev {
          color: #fff !important;
          background: rgba(0, 0, 0, 0.2);
          width: 40px !important;
          height: 40px !important;
          border-radius: 50%;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #3c50e0 !important; /* Cor Brand */
        }
        `}</style>
    </div>
    );
};

export default Carousel;