import React, { useEffect, useState } from 'react';
import { getDailyShop } from '../services/fortniteApi';
import { Filter, ChevronDown, ChevronUp, Loader2, ShoppingCart, X, Gamepad, Sword, Trophy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { robloxService, RobloxProduct } from '../services/robloxService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Objeto con los colores de rareza
const RARITY_COLORS = {
  common: '#B8B8B8',
  uncommon: '#5CCA',
  rare: '#2CC3FC',
  epic: '#B83DBA',
  legendary: '#E95415',
  mythic: '#FBC531',
  marvel: '#C53030',
  dc: '#2B6CB0',
  icon: '#97266D',
  gaming: '#4C51BF',
  starwars: '#2D3748',
  default: '#8B5CF6'
};

interface ShopItem {
  mainId: string;
  offerId: string;
  displayName: string;
  displayDescription: string;
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  rarity: {
    id: string;
    name: string;
  };
  displayAssets: {
    full_background: string;
    background: string;
  }[];
  categories: string[];
  granted: Array<{
    id: string;
    type: {
      id: string;
      name: string;
    };
    gameplayTags: string[];
    name: string;
    description: string;
    images?: {
      icon?: string;
      transparent?: string;
      featured?: string;
      background?: string;
      icon_background?: string;
      full_background?: string;
    };
  }>;
  mainType?: string;
  displayType?: string;
  section?: {
    name?: string;
    category?: string;
  };
}

const FortniteShop: React.FC = () => {
  const { addItem, getItemQuantity, hasItems } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItemForModal, setSelectedItemForModal] = useState<ShopItem | null>(null);

  // Estados para los filtros
  const [rarityFilters, setRarityFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  
  // Estados para los acordeones
  const [isRarityOpen, setIsRarityOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  // Modificar el estado inicial de selectedGame para leer desde URL
  const [selectedGame, setSelectedGame] = useState<'fortnite' | 'roblox' | 'supercell' | 'streaming' | 'leagueoflegends'>(
    (searchParams.get('game') as 'fortnite' | 'roblox' | 'supercell' | 'streaming' | 'leagueoflegends') || 'fortnite'
  );
  const [robloxProducts, setRobloxProducts] = useState<RobloxProduct[]>([]);
  const [loadingRoblox, setLoadingRoblox] = useState(false);
  const [robloxError, setRobloxError] = useState<string | null>(null);
  const [isStepsOpen, setIsStepsOpen] = useState(false);

  useEffect(() => {
    // Si estamos regresando del checkout y tenemos keepCart en true, no hacemos nada
    const state = location.state as { keepCart?: boolean };
    if (state?.keepCart) {
      return;
    }
    fetchItems();
  }, [location]);

  useEffect(() => {
    setFilteredItems(applyAllFilters(items));
  }, [items, rarityFilters, priceRange]);

  useEffect(() => {
    if (selectedGame === 'roblox') {
      loadRobloxProducts();
    }
  }, [selectedGame]);

  // Modificar el efecto del evento gameSelected
  useEffect(() => {
    const handleGameSelected = (event: CustomEvent<string>) => {
      const game = event.detail as 'fortnite' | 'roblox' | 'supercell' | 'streaming' | 'leagueoflegends';
      setSelectedGame(game);
      setSearchParams({ game });
    };

    window.addEventListener('gameSelected', handleGameSelected as EventListener);

    return () => {
      window.removeEventListener('gameSelected', handleGameSelected as EventListener);
    };
  }, [setSearchParams]);

  // Agregar efecto para sincronizar URL con estado
  useEffect(() => {
    const game = searchParams.get('game') as 'fortnite' | 'roblox' | 'supercell' | 'streaming' | 'leagueoflegends';
    if (game && game !== selectedGame) {
      setSelectedGame(game);
    }
  }, [searchParams, selectedGame]);

  const fetchItems = async () => {
    try {
      const data = await getDailyShop();
      // Filtrar los items que son tracks
      const filteredData = data.filter((item: ShopItem) => {
        // Verificar si es un track por su tipo
        const isTrack = item.mainType === 'sparks_song' || 
                       item.displayType === 'Música' ||
                       item.section?.name === 'Pistas de improvisación' ||
                       item.section?.category === 'Sube al escenario';

        // Verificar si alguno de los items concedidos es un track
        const hasTrackGrants = item.granted?.some(grant => 
          grant.type?.id === 'sparks_song' ||
          grant.type?.name === 'Pista de improvisación' ||
          (grant.gameplayTags && grant.gameplayTags.some(tag => 
            tag.toLowerCase().includes('music') ||
            tag.toLowerCase().includes('audio') ||
            tag.toLowerCase().includes('jam') ||
            tag.toLowerCase().includes('song')
          ))
        );

        // Retornar true solo si NO es un track
        return !isTrack && !hasTrackGrants;
      });

      setItems(filteredData);
      setFilteredItems(filteredData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorLoadingItems);
      setLoading(false);
    }
  };

  const loadRobloxProducts = async () => {
    setLoadingRoblox(true);
    setRobloxError(null);
    try {
      const data = await robloxService.getProducts();
      setRobloxProducts(data);
    } catch (err) {
      setRobloxError(err instanceof Error ? err.message : t.errorLoadingItems);
    } finally {
      setLoadingRoblox(false);
    }
  };

  const handleRarityFilter = (rarity: string) => {
    setRarityFilters(prev => {
      const normalized = rarity.toLowerCase();
      return prev.includes(normalized)
        ? prev.filter(r => r !== normalized)
        : [...prev, normalized];
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const applyAllFilters = (items: ShopItem[]) => {
    return items.filter((item) => {
      // Filtros existentes de rareza y precio
      const matchesRarity = rarityFilters.length === 0 || (item.rarity?.id?.toLowerCase() === rarityFilters[0]?.toLowerCase());
      const matchesPrice = item.price?.finalPrice >= priceRange.min && item.price?.finalPrice <= priceRange.max;

      // Nuevo filtro para excluir tracks con verificación de nulos
      const isTrack = item.granted?.some(grant => {
        if (!grant) return false;

        // Verificar si es un tipo de música
        const isMusicType = grant.type?.id === 'music' || grant.type?.id === 'musicpack';
        
        // Verificar etiquetas de gameplay relacionadas con música
        const hasMusicTags = Array.isArray(grant.gameplayTags) && grant.gameplayTags.some(tag => 
          tag && (
            tag.toLowerCase().includes('music') || 
            tag.toLowerCase().includes('audio') ||
            tag.toLowerCase().includes('track')
          )
        );

        // Verificar nombre y descripción
        const hasMusicKeywords = 
          (grant.name?.toLowerCase().includes('track') || 
          grant.name?.toLowerCase().includes('música') ||
          grant.name?.toLowerCase().includes('pista') ||
          grant.description?.toLowerCase().includes('track') ||
          grant.description?.toLowerCase().includes('música') ||
          grant.description?.toLowerCase().includes('pista')) ?? false;

        return isMusicType || hasMusicTags || hasMusicKeywords;
      }) ?? false;

      // Retornar true solo si cumple con todos los filtros y NO es un track
      return matchesRarity && matchesPrice && !isTrack;
    });
  };

  // Obtener rarezas únicas
  const uniqueRarities = Array.from(new Set(
    items.map(item => item.rarity?.name).filter(Boolean)
  ));

  // Función para manejar la adición de items al carrito
  const handleAddToCart = (item: ShopItem) => {
    const result = addItem({
      mainId: item.mainId,
      offerId: item.offerId,
      displayName: item.displayName,
      displayDescription: item.displayDescription,
      price: item.price,
      rarity: item.rarity,
      displayAssets: item.displayAssets,
      categories: item.categories,
      image: item.displayAssets[0]?.full_background || item.displayAssets[0]?.background,
      quantity: 1
    });

    if (result.success) {
      setLastAddedItem(item.displayName);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      setErrorMessage(result.message || t.addToCartError);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  // Función para manejar la adición de items de Roblox al carrito
  const handleAddRobloxToCart = (product: RobloxProduct) => {
    const result = addItem({
      mainId: product.id.toString(),
      offerId: product.id.toString(),
      displayName: product.title,
      displayDescription: product.description,
      price: {
        regularPrice: product.price,
        finalPrice: product.price,
        floorPrice: product.price
      },
      rarity: {
        id: product.type,
        name: product.type
      },
      displayAssets: [{
        full_background: product.image_url ? `${API_URL}${product.image_url}` : '',
        background: product.image_url ? `${API_URL}${product.image_url}` : ''
      }],
      categories: [product.type],
      image: product.image_url ? `${API_URL}${product.image_url}` : '',
      quantity: 1
    });

    if (result.success) {
      setLastAddedItem(product.title);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      setErrorMessage(result.message || t.addToCartError);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleFilterOpen = (filter: 'rarity' | 'price') => {
    if (filter === 'rarity') {
      setIsRarityOpen(!isRarityOpen);
      setIsPriceFilterOpen(false);
    } else {
      setIsPriceFilterOpen(!isPriceFilterOpen);
      setIsRarityOpen(false);
    }
  };

  const toggleItemExpansion = (itemId: string, item: ShopItem) => {
    if (expandedItems.has(itemId)) {
      const newSet = new Set(expandedItems);
      newSet.delete(itemId);
      setExpandedItems(newSet);
      setSelectedItemForModal(null);
    } else {
      setExpandedItems(new Set(expandedItems).add(itemId));
      setSelectedItemForModal(item);
    }
  };

  // Agregar esta función helper al inicio del componente
  const getValidImageUrl = (url?: string): string => {
    if (!url) return '/placeholder-image.jpg';
    
    // Si la URL ya es completa, la devolvemos
    if (url.startsWith('http')) return url;
    
    // Si la URL comienza con //, agregamos https:
    if (url.startsWith('//')) return `https:${url}`;
    
    // Si la URL comienza con /, la consideramos relativa a fortnite-api.com
    if (url.startsWith('/')) return `https://fortnite-api.com${url}`;
    
    // En cualquier otro caso, asumimos que es relativa a fortnite-api.com
    return `https://fortnite-api.com/${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#003554] pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-300">{t.loadingShop}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#003554] pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#003554] pt-28">
      <div className="container mx-auto px-4">
        {/* Layout principal con flex-col en móvil */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar con Game Selector y Pasos */}
          <div className="w-full lg:w-64 lg:shrink-0">
            {/* Game Selector */}
            <div className="bg-[#051923] rounded-xl shadow-md overflow-hidden sticky top-24 mb-4">
              <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-2 sm:gap-3 border-b border-gray-800">
                <Gamepad className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                <span className="text-sm sm:text-base font-medium text-white">Juegos</span>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  <button
                    onClick={() => setSelectedGame('fortnite')}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                      selectedGame === 'fortnite'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700/20'
                    }`}
                  >
                    <div className={`p-1 rounded ${selectedGame === 'fortnite' ? 'bg-primary-700' : 'bg-primary-700/20'}`}>
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Fortnite</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedGame('roblox')}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                      selectedGame === 'roblox'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700/20'
                    }`}
                  >
                    <div className={`p-1 rounded ${selectedGame === 'roblox' ? 'bg-primary-700' : 'bg-primary-700/20'}`}>
                      <Sword className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Roblox</span>
                  </button>

                  <button
                    onClick={() => setSelectedGame('supercell')}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                      selectedGame === 'supercell'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700/20'
                    }`}
                  >
                    <div className={`p-1 rounded ${selectedGame === 'supercell' ? 'bg-primary-700' : 'bg-primary-700/20'}`}>
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">SuperCell</span>
                  </button>

                  <button
                    onClick={() => setSelectedGame('streaming')}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                      selectedGame === 'streaming'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700/20'
                    }`}
                  >
                    <div className={`p-1 rounded ${selectedGame === 'streaming' ? 'bg-primary-700' : 'bg-primary-700/20'}`}>
                      <Gamepad className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">Streaming</span>
                  </button>

                  <button
                    onClick={() => setSelectedGame('leagueoflegends')}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all ${
                      selectedGame === 'leagueoflegends'
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-primary-700/20'
                    }`}
                  >
                    <div className={`p-1 rounded ${selectedGame === 'leagueoflegends' ? 'bg-primary-700' : 'bg-primary-700/20'}`}>
                      <Sword className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-sm sm:text-base font-medium">League of Legends</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pasos a seguir - Colapsable en móvil */}
            <div className="bg-[#051923] rounded-xl shadow-md overflow-hidden mb-4 lg:mb-0">
              <button
                onClick={() => setIsStepsOpen(!isStepsOpen)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-gray-800 lg:cursor-default"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                  <span className="text-sm sm:text-base font-medium text-white">Pasos a seguir</span>
                </div>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-300 transition-transform lg:hidden ${isStepsOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`transition-all duration-300 ${isStepsOpen ? 'max-h-[500px]' : 'max-h-0 lg:max-h-[500px]'} overflow-hidden`}>
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-medium">
                      1
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Asegúrate de estar en nuestra lista de amigos por al menos 48hs.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-medium">
                      2
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Elige la skin que deseas de la rotación diaria de la Tienda. Paga en tu moneda local con nuestros métodos seguros.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs sm:text-base font-medium">
                      3
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Recibe inmediatamente las skins en tu cuenta enviadas por nuestros bots.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1">
            {selectedGame === 'fortnite' ? (
              <div>
                {/* Filtros - Grid responsivo */}
                <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Filtro de Rareza */}
                  <div className={`bg-[#051923] rounded-xl shadow-md ${!isRarityOpen && 'h-[60px] sm:h-[72px]'}`}>
                    <button
                      onClick={() => handleFilterOpen('rarity')}
                      className="w-full h-[60px] sm:h-[72px] px-4 sm:px-6 flex items-center justify-between text-white hover:bg-primary-700/20 transition-colors rounded-xl"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                        <span className="text-sm sm:text-base font-medium">{t.rarity}</span>
                      </div>
                      {isRarityOpen ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      )}
                    </button>
            
                    {isRarityOpen && (
                      <div className="p-3 sm:p-6 border-t border-gray-800">
                        <div className="flex flex-wrap gap-2">
                          {uniqueRarities.map((rarity) => (
                            <button
                              key={rarity}
                              onClick={() => handleRarityFilter(rarity)}
                              className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                                rarityFilters.includes(rarity.toLowerCase())
                                  ? 'bg-primary-600 text-white'
                                  : 'hover:bg-primary-700/20 text-gray-300'
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                  rarityFilters.includes(rarity.toLowerCase()) ? 'bg-white' : 'bg-primary-400'
                                }`}
                              />
                              {rarity}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Filtro de Precio */}
                  <div className={`bg-[#051923] rounded-xl shadow-md ${!isPriceFilterOpen && 'h-[60px] sm:h-[72px]'}`}>
                    <button
                      onClick={() => handleFilterOpen('price')}
                      className="w-full h-[60px] sm:h-[72px] px-4 sm:px-6 flex items-center justify-between text-white hover:bg-primary-700/20 transition-colors rounded-xl"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                        <span className="text-sm sm:text-base font-medium">{t.filterByPrice}</span>
                      </div>
                      {isPriceFilterOpen ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                      )}
                    </button>
            
                    {isPriceFilterOpen && (
                      <div className="p-3 sm:p-6 border-t border-gray-800">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                            <span>{priceRange.min} {t.vbucks}</span>
                            <span>{priceRange.max} {t.vbucks}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            value={priceRange.max}
                            onChange={handlePriceChange}
                            name="max"
                            className="w-full h-1.5 sm:h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid de Items - Responsivo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {filteredItems.map((item) => {
                    const rarityColor = RARITY_COLORS[item.rarity?.id?.toLowerCase() as keyof typeof RARITY_COLORS] || RARITY_COLORS.default;
                    
                    return (
                      <div 
                        key={item.mainId}
                        className={`group rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex`}
                        style={{ backgroundColor: rarityColor }}
                      >
                        {/* Contenedor de imagen y descuento */}
                        <div className="relative w-1/2">
                          {/* Etiqueta de descuento */}
                          {item.price.regularPrice > item.price.finalPrice && (
                            <div className="absolute top-0 left-0 bg-black text-white px-4 py-1 z-10 rounded-br-lg">
                              {Math.round((1 - item.price.finalPrice/item.price.regularPrice) * 100)} PAVOS DE DESCUENTO
                            </div>
                          )}
                          
                          {/* Imagen principal */}
                          <img
                            src={
                              getValidImageUrl(item.displayAssets?.[0]?.full_background) ||
                              getValidImageUrl(item.displayAssets?.[0]?.background) ||
                              getValidImageUrl(item.granted?.[0]?.images?.icon) ||
                              getValidImageUrl(item.granted?.[0]?.images?.featured) ||
                              getValidImageUrl(item.granted?.[0]?.images?.transparent) ||
                              getValidImageUrl(item.granted?.[0]?.images?.full_background) ||
                              getValidImageUrl(item.granted?.[0]?.images?.background) ||
                              getValidImageUrl(item.granted?.[0]?.images?.icon_background) ||
                              getValidImageUrl(item.granted?.[1]?.images?.icon) ||
                              getValidImageUrl(item.granted?.[1]?.images?.featured) ||
                              getValidImageUrl(item.displayAssets?.[1]?.full_background) ||
                              getValidImageUrl(item.displayAssets?.[1]?.background) ||
                              '/placeholder-image.jpg'
                            }
                            alt={item.displayName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              if (!target.src.includes('/placeholder-image.jpg')) {
                                console.log(`Error loading image for item: ${item.displayName}`);
                                console.log('Failed URL:', target.src);
                                console.log('Available sources:', {
                                  displayAssets: item.displayAssets,
                                  grantedImages: item.granted?.map(g => g.images)
                                });
                                target.src = '/placeholder-image.jpg';
                              }
                            }}
                          />
                        </div>

                        {/* Contenido del bundle */}
                        <div className="w-1/2 p-6 flex flex-col justify-between">
                          <div>
                            {/* Título del bundle */}
                            <h3 className="text-xl font-bold text-white mb-4">
                              {item.displayName}
                            </h3>

                            {/* Sección "INCLUYE:" modificada */}
                            <div className="mb-4">
                              <p className="text-white/80 text-xs font-medium mb-2">INCLUYE:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {item.granted?.slice(0, 2).map((grantedItem, index) => (
                                  <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg p-1.5 flex items-center gap-2">
                                    <div className="w-8 h-8 flex-shrink-0 bg-black/30 rounded overflow-hidden">
                                      <img 
                                        src={
                                          getValidImageUrl(grantedItem.images?.icon) ||
                                          getValidImageUrl(grantedItem.images?.featured) ||
                                          getValidImageUrl(grantedItem.images?.transparent) ||
                                          getValidImageUrl(grantedItem.images?.full_background) ||
                                          getValidImageUrl(grantedItem.images?.background) ||
                                          getValidImageUrl(grantedItem.images?.icon_background) ||
                                          getValidImageUrl(item.displayAssets?.[0]?.full_background) ||
                                          getValidImageUrl(item.displayAssets?.[0]?.background) ||
                                          getValidImageUrl(item.displayAssets?.[1]?.full_background) ||
                                          '/placeholder-image.jpg'
                                        }
                                        alt={grantedItem.name}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.onerror = null;
                                          if (!target.src.includes('/placeholder-image.jpg')) {
                                            console.log(`Error loading granted item image: ${grantedItem.name}`);
                                            console.log('Failed URL:', target.src);
                                            console.log('Available sources:', {
                                              grantedItemImages: grantedItem.images,
                                              mainItemDisplayAssets: item.displayAssets
                                            });
                                            target.src = '/placeholder-image.jpg';
                                          }
                                        }}
                                      />
                                    </div>
                                    <span className="text-white/90 text-xs font-medium line-clamp-1">
                                      {grantedItem.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {item.granted && item.granted.length > 2 && (
                                <button
                                  onClick={() => toggleItemExpansion(item.mainId, item)}
                                  className="mt-2 w-full py-1 px-3 bg-black/20 hover:bg-black/30 transition-colors rounded-lg text-white/90 text-xs font-medium"
                                >
                                  {expandedItems.has(item.mainId) ? 'Ver menos' : `Ver ${item.granted.length - 2} items más`}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Precio y botón */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-white text-2xl font-bold">
                                {item.price.finalPrice} {t.vbucks}
                              </span>
                              {item.price.regularPrice > item.price.finalPrice && (
                                <span className="text-gray-300 line-through">
                                  {item.price.regularPrice} {t.vbucks}
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => handleAddToCart(item)}
                              className={`w-full py-3 px-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors ${
                                hasItems && getItemQuantity(item.mainId) === 0
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
                              disabled={hasItems && getItemQuantity(item.mainId) === 0}
                            >
                              Añadir al Carrito
                              {getItemQuantity(item.mainId) > 0 && (
                                <span className="ml-2 bg-[#7C3AED] px-2 py-1 rounded-full text-sm">
                                  {getItemQuantity(item.mainId)}
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Notificaciones */}
                {showNotification && (
                  <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span>{lastAddedItem} {t.addedToCart}</span>
                    </div>
                  </div>
                )}

                {showErrorMessage && (
                  <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5" />
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {filteredItems.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {t.noItemsFound}
                    </p>
                  </div>
                )}
              </div>
            ) : selectedGame === 'roblox' ? (
              <div>
                {loadingRoblox ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                  </div>
                ) : robloxError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">{robloxError}</p>
                    <button 
                      onClick={loadRobloxProducts}
                      className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {t.retry}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                      {robloxProducts.map((product) => (
                        <div 
                          key={product.id}
                          className="group bg-[#051923] rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-800">
                            {product.image_url && (
                              <img
                                src={`${API_URL}${product.image_url}`}
                                alt={product.title}
                                className="h-full w-full object-cover object-center"
                              />
                            )}
                          </div>
                          <div className="p-2 sm:p-3 lg:p-6">
                            <div>
                              <h3 className="text-xs sm:text-sm lg:text-lg font-medium text-white line-clamp-1 sm:line-clamp-2">
                                {product.title}
                              </h3>
                              <p className="mt-0.5 sm:mt-1 lg:mt-2 text-[10px] sm:text-xs lg:text-sm text-gray-400">{product.description}</p>
                              {product.amount && (
                                <p className="mt-0.5 sm:mt-1 lg:mt-2 text-[10px] sm:text-xs lg:text-sm text-gray-400">
                                  Cantidad: {product.amount}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center justify-between">
                              <p className="text-xs sm:text-sm lg:text-lg font-medium text-primary-400">
                                ${product.price}
                              </p>
                              <button
                                onClick={() => handleAddRobloxToCart(product)}
                                className="p-1 sm:p-1.5 lg:p-2 rounded-full text-primary-400 hover:bg-primary-700 transition-colors"
                                title={t.addToCart}
                              >
                                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {robloxProducts.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-600">
                          No hay productos disponibles
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : selectedGame === 'supercell' ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Próximamente: Contenido de SuperCell</p>
              </div>
            ) : selectedGame === 'streaming' ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Próximamente: Contenido de Streaming</p>
              </div>
            ) : selectedGame === 'leagueoflegends' ? (
              <div className="text-center py-12">
                <p className="text-gray-300">Próximamente: Contenido de League of Legends</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Modal para mostrar todos los items */}
      {selectedItemForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#051923] rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">{selectedItemForModal.displayName}</h3>
                <button 
                  onClick={() => setSelectedItemForModal(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-white/80 text-sm font-medium mb-4">INCLUYE:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedItemForModal.granted?.map((grantedItem, index) => (
                  <div key={index} className="bg-black/20 backdrop-blur-sm rounded-lg p-2 flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-black/30 rounded overflow-hidden">
                      <img 
                        src={
                          getValidImageUrl(grantedItem.images?.icon) ||
                          getValidImageUrl(grantedItem.images?.featured) ||
                          getValidImageUrl(grantedItem.images?.transparent) ||
                          getValidImageUrl(grantedItem.images?.full_background) ||
                          getValidImageUrl(grantedItem.images?.background) ||
                          getValidImageUrl(grantedItem.images?.icon_background) ||
                          getValidImageUrl(selectedItemForModal.displayAssets?.[0]?.full_background) ||
                          getValidImageUrl(selectedItemForModal.displayAssets?.[0]?.background) ||
                          getValidImageUrl(selectedItemForModal.displayAssets?.[1]?.full_background) ||
                          '/placeholder-image.jpg'
                        }
                        alt={grantedItem.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          if (!target.src.includes('/placeholder-image.jpg')) {
                            console.log(`Error loading modal image: ${grantedItem.name}`);
                            console.log('Failed URL:', target.src);
                            console.log('Available sources:', {
                              grantedItemImages: grantedItem.images,
                              modalItemDisplayAssets: selectedItemForModal.displayAssets
                            });
                            target.src = '/placeholder-image.jpg';
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-white font-medium text-sm line-clamp-1">
                        {grantedItem.name}
                      </span>
                      <span className="text-white/60 text-xs line-clamp-1">
                        {grantedItem.type.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FortniteShop;