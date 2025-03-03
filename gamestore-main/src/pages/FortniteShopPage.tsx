import React from 'react';
import FortniteShop from '../components/FortniteShop';
import { Helmet } from 'react-helmet-async';

const FortniteShopPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tienda de Fortnite | GameStore</title>
        <meta name="description" content="Explora la tienda diaria de Fortnite con los últimos items, skins, emotes y más." />
      </Helmet>
      
      {/* Contenedor principal con padding-top aumentado */}
      <div className="min-h-screen bg-[#FAFAFA] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Tienda Diaria de Fortnite
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora los items más recientes de la tienda de Fortnite. 
              Actualizada diariamente con los mejores cosméticos y paquetes.
            </p>
          </div>
          
          <FortniteShop />
        </div>
      </div>
    </>
  );
};

export default FortniteShopPage;
