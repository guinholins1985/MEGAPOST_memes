
import React from 'react';

interface MemePreviewProps {
  imageSrc: string | null;
  topText: string;
  bottomText:string;
}

export const MemePreview: React.FC<MemePreviewProps> = ({ imageSrc, topText, bottomText }) => {
  return (
    <div className="w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
      {imageSrc ? (
        <>
          <img src={imageSrc} alt="Meme preview" className="max-w-full max-h-full object-contain" />
          <p className="meme-text text-white text-3xl md:text-4xl lg:text-5xl absolute top-4 left-1/2 -translate-x-1/2 w-11/12 text-center break-words">
            {topText}
          </p>
          <p className="meme-text text-white text-3xl md:text-4xl lg:text-5xl absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 text-center break-words">
            {bottomText}
          </p>
        </>
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