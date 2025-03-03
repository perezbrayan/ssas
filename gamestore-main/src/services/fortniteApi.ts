import axios from 'axios';

export interface FortniteItem {
  mainId: string;
  offerId: string;
  displayName: string;
  displayDescription: string;
  displayType: string;
  mainType: string;
  displayAssets: {
    full_background: string;
    background: string;
  }[];
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  rarity: {
    id: string;
    name: string;
  };
  section: {
    id: string;
    name: string;
  };
  granted: Array<{
    type: {
      name: string;
    };
    images?: {
      icon?: string;
      transparent?: string;
      featured?: string;
      background?: string;
      icon_background?: string;
      full_background?: string;
    };
  }>;
  buyAllowed: boolean;
  categories: string[];
  banner: any;
  giftAllowed: boolean;
  groupIndex: number;
  offerTag: string | null;
  priority: number;
  images: {
    icon: string;
    featured: string;
    transparent?: string;
  };
}

export const getDailyShop = async () => {
  try {
    const response = await fetch('https://fortniteapi.io/v2/shop?lang=en', {
      headers: {
        'Authorization': 'eafc4329-54aeed01-a90cd52b-f749534c'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de la tienda: ' + response.statusText);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);

    if (!data.shop || !Array.isArray(data.shop)) {
      throw new Error('Formato de respuesta inválido: no se encontró shop o no es un array');
    }

    const items = data.shop
      .filter((item: any) => {
        // Verificar si el item es válido
        if (!item || !item.mainId) return false;
        
        // Verificar si tiene imágenes válidas
        const hasValidImages = Boolean(
          item.displayAssets?.[0]?.url || // Nueva URL de displayAssets
          item.granted?.[0]?.images?.icon ||
          item.granted?.[0]?.images?.transparent ||
          item.displayAssets?.[0]?.background
        );

        return hasValidImages;
      })
      .map((item: any) => ({
        mainId: item.mainId,
        offerId: item.offerId,
        displayName: item.displayName || '',
        displayDescription: item.displayDescription || '',
        displayType: item.displayType || '',
        mainType: item.mainType || '',
        displayAssets: item.displayAssets?.map((asset: any) => ({
          full_background: asset.url || asset.full_background || '', // Usar url primero
          background: asset.background || ''
        })) || [],
        price: {
          regularPrice: item.price?.regularPrice || 0,
          finalPrice: item.price?.finalPrice || 0,
          floorPrice: item.price?.floorPrice || 0
        },
        rarity: {
          id: item.rarity?.id || '',
          name: item.rarity?.name || ''
        },
        section: {
          id: item.section?.id || '',
          name: item.section?.name || ''
        },
        granted: item.granted?.map((grant: any) => ({
          type: {
            name: grant.type?.name || grant.type || ''
          },
          images: {
            icon: grant.images?.icon || '',
            transparent: grant.images?.transparent || '',
            featured: grant.images?.featured || '',
            background: grant.images?.background || '',
            icon_background: grant.images?.icon_background || '',
            full_background: grant.images?.full_background || ''
          }
        })) || [],
        buyAllowed: item.buyAllowed || false,
        categories: item.categories || [],
        banner: item.banner,
        giftAllowed: item.giftAllowed || false,
        groupIndex: item.groupIndex || 0,
        offerTag: item.offerTag || null,
        priority: item.priority || 0,
        images: {
          icon: item.granted?.[0]?.images?.icon || '',
          featured: item.displayAssets?.[0]?.url || item.displayAssets?.[0]?.full_background || '',
          transparent: item.granted?.[0]?.images?.transparent || ''
        }
      }));

    // Agregar log para ver la estructura de las imágenes
    console.log('Ejemplo de imágenes en item procesado:', {
      displayAssets: items[0]?.displayAssets,
      grantedImages: items[0]?.granted?.[0]?.images,
      images: items[0]?.images
    });

    console.log('Items procesados:', items.length);
    console.log('Ejemplo de item procesado:', items[0]);
    return items;
  } catch (error) {
    console.error('Error en getDailyShop:', error);
    throw new Error('Error al cargar los ítems de la tienda.');
  }
};