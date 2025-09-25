import React, { useState, Component } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
const galleryImages = [{
  id: 1,
  src: 'https://i.postimg.cc/sDpGPCyR/531282655-122207768174126286-920943197667186533-n.jpg',
  alt: 'Students in classroom',
  category: 'Classroom',
  type: 'image'
}, {
  id: 2,
  src: 'https://i.postimg.cc/HsCVkvMv/542034801-122209711238126286-2295732649127187956-n.jpg',
  alt: 'Student receiving certificate',
  category: 'Graduation',
  type: 'image'
}, {
  id: 3,
  src: 'https://i.postimg.cc/28F3bdFk/542696045-122209842692126286-9188897384592393149-n.jpg',
  alt: 'Group study session',
  category: 'Study Group',
  type: 'image'
}, {
  id: 4,
  src: 'https://i.postimg.cc/8zpchFth/545791421-122210258174126286-5777994471076916102-n.jpg',
  alt: 'Students collaborating',
  category: 'Collaboration',
  type: 'image'
}, {
  id: 5,
  src: 'https://i.postimg.cc/PqNqRgGJ/546145133-122210346314126286-1595137416381773339-n.jpg',
  alt: 'Modern classroom facilities',
  category: 'Facilities',
  type: 'image'
}, {
  id: 6,
  videoId: 'TTYaBhi4L3Y',
  alt: 'Speaking practice session',
  category: 'Speaking',
  type: 'video',
  thumbnailSrc: 'https://i.postimg.cc/SN0zzNBr/532862115-122207767376126286-1782722394302885862-n.jpg'
}];
const Gallery: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  const goToPrevious = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
  };
  const goToNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % galleryImages.length);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };
  return <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
        {galleryImages.map((image, index) => <div key={image.id} className={`relative group cursor-pointer bg-white border-2 border-primary p-2 shadow-[4px_4px_0px_0px_rgba(10,42,102,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(10,42,102,1)] ${index === 0 ? 'rotate-[-1deg]' : index === 1 ? 'rotate-[1deg]' : index === 2 ? 'rotate-[-0.5deg]' : index === 3 ? 'rotate-[0.5deg]' : index === 4 ? 'rotate-[-1.5deg]' : 'rotate-[1.5deg]'}`} onClick={() => openLightbox(index)} tabIndex={0} onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      }} aria-label={`View ${image.alt}`} role="button">
            <div className="overflow-hidden">
              <img src={image.type === 'image' || image.type === 'facebook-video' ? image.type === 'image' ? image.src : image.thumbnailSrc : image.thumbnailSrc} alt={image.alt} className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
              {(image.type === 'video' || image.type === 'facebook-video') && <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/70 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>}
            </div>
            <div className="bg-primary text-white p-2 mt-1">
              <span className="font-bold text-sm block">{image.alt}</span>
              <span className="text-xs opacity-80">{image.category}</span>
            </div>
            <div className="absolute -top-3 -right-3 bg-accent text-white text-xs font-bold px-2 py-1 rotate-6 border border-primary shadow-sm">
              {image.type === 'video' || image.type === 'facebook-video' ? 'VIDEO' : `PHOTO #${index + 1}`}
            </div>
          </div>)}
      </div>
      {/* Retro-styled decorative elements */}
      <div className="flex justify-center mt-8">
        <div className="w-24 h-1 bg-primary mx-2"></div>
        <div className="w-4 h-4 bg-accent rotate-45 transform -translate-y-1.5"></div>
        <div className="w-24 h-1 bg-primary mx-2"></div>
      </div>
      {/* Lightbox Modal */}
      {lightboxOpen && <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox} onKeyDown={handleKeyDown} tabIndex={0} role="dialog" aria-modal="true" aria-label="Image gallery lightbox">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="bg-white border-4 border-primary p-3 max-w-4xl max-h-[90vh] shadow-[8px_8px_0px_0px_rgba(198,165,69,1)]">
              {galleryImages[activeIndex].type === 'image' ? <img src={galleryImages[activeIndex].src} alt={galleryImages[activeIndex].alt} className="max-w-full max-h-[70vh] object-contain" onClick={e => e.stopPropagation()} /> : galleryImages[activeIndex].type === 'facebook-video' ? <div className="w-full max-w-4xl aspect-video">
                  <iframe src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(galleryImages[activeIndex].fbVideoUrl)}&show_text=false`} width="100%" height="100%" style={{
              border: 'none',
              overflow: 'hidden'
            }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" onClick={e => e.stopPropagation()}></iframe>
                </div> : <div className="w-full max-w-4xl aspect-video">
                  <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${galleryImages[activeIndex].videoId}`} title={galleryImages[activeIndex].alt} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen onClick={e => e.stopPropagation()}></iframe>
                </div>}
              <div className="mt-3 bg-primary text-white p-3">
                <h3 className="text-base sm:text-xl font-bold">
                  {galleryImages[activeIndex].alt}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  {galleryImages[activeIndex].category}
                </p>
              </div>
            </div>
            <button className="absolute top-4 right-4 bg-white border-2 border-primary text-primary hover:text-accent p-2 shadow-[2px_2px_0px_0px_rgba(10,42,102,1)]" onClick={closeLightbox} aria-label="Close lightbox">
              <X className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border-2 border-primary text-primary hover:text-accent p-2 shadow-[2px_2px_0px_0px_rgba(10,42,102,1)]" onClick={e => {
          e.stopPropagation();
          goToPrevious();
        }} aria-label="Previous image">
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border-2 border-primary text-primary hover:text-accent p-2 shadow-[2px_2px_0px_0px_rgba(10,42,102,1)]" onClick={e => {
          e.stopPropagation();
          goToNext();
        }} aria-label="Next image">
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>
        </div>}
    </>;
};
export default Gallery;