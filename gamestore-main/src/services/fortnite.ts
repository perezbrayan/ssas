import axios from 'axios';

export const getDailyShop = async () => {
  try {
    const response = await axios.get('https://fortnite-api.com/v2/shop/br/combined');
    
    // Transformar los datos para que coincidan con nuestra interfaz
    const items = response.data.data.featured.entries.map((entry: any) => ({
      displayName: entry.items[0].name,
      displayDescription: entry.items[0].description,
      price: {
        regularPrice: entry.regularPrice,
        finalPrice: entry.finalPrice
      },
      granted: entry.items.map((item: any) => ({
        type: {
          name: item.type.value
        }
      })),
      rarity: {
        value: entry.items[0].rarity.value
      },
      images: {
        icon: entry.items[0].images.icon,
        featured: entry.items[0].images.featured || entry.items[0].images.icon
      }
    }));
    
    return items;
  } catch (error) {
    console.error('Error fetching shop data:', error);
    throw error;
  }
}; 