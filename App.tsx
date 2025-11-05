import React, { useState, useRef } from 'react';
import { generateMemeContent } from './services/geminiService';
import { MemePreview } from './components/MemePreview';
import { UploadIcon, DownloadIcon, SparklesIcon, SpinnerIcon } from './components/Icons';

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justGenerated, setJustGenerated] = useState(false); // New state for highlight effect
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateContentFromImage = async (base64: string, mimeType: string) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    setJustGenerated(false);
    setTopText('');
    setBottomText('');
    setGeneratedPost('');
    try {
      const { topText, bottomText, post } = await generateMemeContent(base64, mimeType);
      setTopText(topText);
      setBottomText(bottomText);
      setGeneratedPost(post);
      setJustGenerated(true);
      setTimeout(() => setJustGenerated(false), 1500);
    } catch (err) {
      setError('Falha ao gerar o conteúdo com IA. Tente outra imagem ou gere novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageSrc(dataUrl);

        const mimeType = file.type;
        const base64 = dataUrl.split(',')[1];
        setImageBase64(base64);
        setImageMimeType(mimeType);

        generateContentFromImage(base64, mimeType);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRegenerateClick = () => {
    if (imageBase64 && imageMimeType && !isLoading) {
      generateContentFromImage(imageBase64, imageMimeType);
    }
  };

  const handleDownloadClick = () => {
    if (!imageSrc) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const fontSize = img.width / 8; // Increased for more impact
      ctx.font = `${fontSize}px Anton, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = fontSize / 12; // Increased for thicker outline
      ctx.textAlign = 'center';

      // Top text
      ctx.textBaseline = 'top';
      const topY = 20; // Added padding
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY);

      // Bottom text
      ctx.textBaseline = 'bottom';
      const bottomY = canvas.height - 20; // Added padding
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY);

      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Gerador de Memes IA
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Crie e impulsione seu conteúdo viral</p>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">1. Escolha uma Imagem</h2>
          <p className="text-gray-400 -mt-4">A IA irá gerar os textos automaticamente!</p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            <UploadIcon />
            {imageSrc ? 'Trocar Imagem' : 'Carregar Imagem'}
          </button>
          
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 pt-4">2. Edite o Texto</h2>

          <div className="space-y-4">
            <div className={`rounded-lg ${justGenerated ? 'highlight-generated' : ''}`}>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder={isLoading ? "Analisando imagem..." : "Texto de cima"}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
            <div className={`rounded-lg ${justGenerated ? 'highlight-generated' : ''}`}>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder={isLoading ? "Analisando imagem..." : "Texto de baixo"}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            onClick={handleRegenerateClick}
            disabled={isLoading || !imageSrc}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? <SpinnerIcon /> : <SparklesIcon />}
            {isLoading ? 'Gerando...' : 'Gerar Novamente'}
          </button>
          
          {error && <p className="text-red-400 text-center">{error}</p>}

          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2 pt-4">3. Salve e Publique</h2>
          <button
            onClick={handleDownloadClick}
            disabled={!imageSrc || isLoading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <DownloadIcon />
            Baixar Meme
          </button>
        </div>

        {/* Preview and Output Panel */}
        <div className="space-y-8">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-center">Pré-visualização do Meme</h3>
            <MemePreview imageSrc={imageSrc} topText={topText} bottomText={bottomText} />
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl min-h-[200px]">
            <h3 className="text-xl font-semibold mb-4 text-center">Legenda Gerada com IA</h3>
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-full text-center">
                <SpinnerIcon />
                <p className="text-gray-400 animate-pulse mt-2">A IA está analisando sua imagem e criando o conteúdo...</p>
              </div>
            ) : (
              <div 
                className={`prose prose-invert prose-p:text-gray-300 whitespace-pre-wrap p-4 bg-gray-900 rounded-lg min-h-[100px] cursor-pointer ${justGenerated ? 'highlight-generated' : ''}`}
                title="Clique para copiar"
                onClick={() => generatedPost && navigator.clipboard.writeText(generatedPost)}
              >
                {generatedPost || <span className="text-gray-500">Sua legenda aparecerá aqui...</span>}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}