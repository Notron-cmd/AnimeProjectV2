import Image from 'next/image';

export default function AnimeBanner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full h-[320px] sm:h-[450px] md:h-[550px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-[#121317]/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#121317] via-transparent to-transparent z-10 w-full md:w-2/3" />
      <Image 
        src={src} 
        alt={alt} 
        fill
        sizes="100vw"
        priority
        className="object-cover object-top opacity-50"
      />
    </div>
  );
}