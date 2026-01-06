import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ImageSlider = ({ images = [] }) => {
  // Default promotional images if none provided
  const defaultImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Modern Furniture Collection',
      title: 'Modern Furniture Collection',
      subtitle: 'Discover our latest designs'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Comfortable Living Spaces',
      title: 'Comfortable Living Spaces',
      subtitle: 'Transform your home with style'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'Premium Wardrobes',
      title: 'Premium Wardrobes',
      subtitle: 'Organize in style'
    }
  ];

  const slidesToShow = images.length > 0 ? images : defaultImages;

  return (
    <div className="w-full h-64 md:h-96 lg:h-[500px] relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {slidesToShow.map((image) => (
          <SwiperSlide key={image.id}>
            <div className="relative w-full h-full">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                    {image.title}
                  </h2>
                  <p className="text-sm md:text-lg lg:text-xl opacity-90">
                    {image.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;