import React from 'react';

interface MemePreviewProps {
  imageSrc: string | null;
  topText: string;
  bottomText:string;
}

export const MemePreview: React.FC<MemePreviewProps> = ({ imageSrc, topText, bottomText }) => {
  return (
    <div className="w-full aspect-square bg-gray-900 rounded-lg flex flex-col items-center justify-center overflow-hidden">
      {imageSrc ? (
        <div className="w-full h-full flex flex-col bg-black">
          <div className="w-full flex-grow flex items-center justify-center text-center p-2">
             <p className="meme-text text-3xl md:text-4xl lg:text-5xl break-words w-full leading-tight">
                {topText}
             </p>
          </div>
          <img src={imageSrc} alt="Meme preview" className="w-full object-contain max-h-[60%]" />
          <div className="w-full flex-grow flex items-center justify-center text-center p-2">
            <p className="meme-text text-3xl md:text-4xl lg:text-5xl break-words w-full leading-tight">
                {bottomText}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2">Sua imagem aparecerá aqui</p>
        </div>
      )}
    </div>
  );
};