import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, Gift, LogOut } from 'lucide-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

interface CheckoutItem {
  mainId: string;
  offerId: string;
  displayName: string;
  price: {
    finalPrice: number;
  };
  image: string;
}

interface OrderSummaryProps {
  item: CheckoutItem;
  onContinue: () => void;
}

interface UserInformationProps {
  onContinue: (username: string) => void;
  onBack: () => void;
}

interface PaymentInformationProps {
  onContinue: (info: { paymentProof: File }) => void;
  onBack: () => void;
}

interface PaymentProps {
  item: CheckoutItem;
  username: string;
  onBack: () => void;
}

const CheckoutSteps = ({ currentStep, isAuthenticated }: { currentStep: number, isAuthenticated: boolean }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const steps = [
    { title: t.orderSummary, description: t.productDetails },
    ...(!isAuthenticated ? [{ title: t.userInformation, description: t.enterFortniteUsername }] : []),
    { title: t.paymentInformation, description: t.bankDetails },
    { title: t.confirmOrder, description: t.orderConfirmed }
  ];

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <div key={step.title} className="flex-1">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-white">{step.title}</div>
                <div className="text-xs text-gray-300">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderSummary = ({ item, onContinue }: OrderSummaryProps) => {
  const navigate = useNavigate();
  const { items: cartItems } = useCart();
  const { language } = useLanguage();
  const t = translations[language];

  const handleBack = () => {
    if (cartItems.length > 0) {
      navigate('/fortnite-shop', { state: { keepCart: true } });
    } else {
      navigate('/fortnite-shop');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-8">{t.productDetails}</h2>
      <div className="flex gap-8 mb-8">
        <div className="w-1/3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#051923]">
            <img
              src={item.image}
              alt={item.displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-4">{item.displayName}</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Gift className="w-5 h-5 text-primary-500" />
              <span>{t.specialGift}</span>
            </div>
            <p className="text-gray-300">{t.quantity}: 1</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary-400">{item.price.finalPrice}</span>
              <span className="text-gray-300">{t.vbucks}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-gray-700">
        <button
          onClick={handleBack}
          className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
        >
          {t.backToStore}
        </button>
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
        >
          {t.continue}
        </button>
      </div>
    </div>
  );
};

const UserInformation = ({ onContinue, onBack }: UserInformationProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError(t.enterUsername);
      return;
    }
    onContinue(username);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-8">{t.userInformation}</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
            {t.fortniteUsername}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#051923] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
            placeholder={t.enterFortniteUsername}
          />
          {error && (
            <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            {t.back}
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
          >
            {t.continue}
          </button>
        </div>
      </form>
    </div>
  );
};

const PaymentInformation = ({ onContinue, onBack }: PaymentInformationProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  const t = translations[language];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t.invalidImage);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(t.imageSizeLimit);
        return;
      }
      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        localStorage.setItem('paymentProof', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError(t.uploadRequired);
      return;
    }
    onContinue({ paymentProof: selectedFile });
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-8">{t.paymentInformation}</h2>
      <div className="max-w-xl mx-auto">
        <div className="bg-[#051923] p-6 rounded-xl mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">{t.bankDetails}</h3>
          <div className="space-y-6">
            {/* BANRURAL */}
            <div className="p-4 bg-[#051923] border border-gray-700 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">BANRURAL</p>
                <p className="text-gray-300">Cuenta Monetaria</p>
                <p className="text-gray-300">No. de cuenta: 03103500001370</p>
                <p className="text-gray-300">A nombre de: Jose Martínez</p>
              </div>
            </div>

            {/* G&T CONTINENTAL */}
            <div className="p-4 bg-[#051923] border border-gray-700 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">BANCO G&T CONTINENTAL</p>
                <p className="text-gray-300">Cuenta Monetaria</p>
                <p className="text-gray-300">No. de cuenta: 039-0019192-5</p>
                <p className="text-gray-300">A nombre de: Jose Martínez</p>
              </div>
            </div>

            {/* BANCO INDUSTRIAL */}
            <div className="p-4 bg-[#051923] border border-gray-700 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">BANCO INDUSTRIAL</p>
                <p className="text-gray-300">Cuenta de ahorro</p>
                <p className="text-gray-300">No. de cuenta: 0525075</p>
                <p className="text-gray-300">A nombre de: Jose Martínez</p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-primary-400">
                <strong>{t.uploadRequired}</strong>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.paymentProof}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleClickUpload}
                className="w-full px-4 py-3 bg-[#051923] border-2 border-dashed border-gray-700 rounded-xl text-gray-300 hover:text-primary-400 hover:border-primary-400 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {selectedFile ? t.changeProof : t.uploadProof}
              </button>
              
              {previewUrl && (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt={t.paymentProof} 
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              {t.back}
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              {t.continue}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Payment = ({ item, username, onBack }: PaymentProps) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const { language } = useLanguage();
  const t = translations[language];
  const mounted = React.useRef(true);

  // Verificar conexión al montar el componente
  React.useEffect(() => {
    const verifyConnection = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/db/api/health`);
        console.log('Estado del servidor:', response.data);
      } catch (error) {
        console.error('Error al verificar conexión:', error);
      }
    };

    verifyConnection();
  }, []);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handlePayment = async () => {
    if (processing) return;

    try {
      console.log('Iniciando proceso de pago...');
      setProcessing(true);
      setError('');
      setSuccess(false);
      
      if (!item.offerId || !item.displayName || !item.price?.finalPrice || !username) {
        console.log('Faltan campos requeridos:', { item, username });
        setError(t.requiredFields);
        setProcessing(false);
        return;
      }

      const formData = new FormData();
      formData.append('offer_id', item.offerId);
      formData.append('item_name', item.displayName);
      formData.append('price', item.price.finalPrice.toString());
      formData.append('username', username);
      
      const paymentProofFile = localStorage.getItem('paymentProof');
      if (paymentProofFile) {
        console.log('Procesando comprobante de pago...');
        const response = await fetch(paymentProofFile);
        const blob = await response.blob();
        formData.append('payment_receipt', blob, 'payment_receipt.jpg');
      }

      console.log('Enviando solicitud al servidor...', {
        url: `${import.meta.env.VITE_API_URL}/db/api/fortnite/orders`,
        formData: Object.fromEntries(formData.entries())
      });

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/db/api/fortnite/orders`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Respuesta del servidor recibida:', response.data);

      if (mounted.current) {
        console.log('Componente montado, procesando respuesta...');
        
        if (response.data.success) {
          console.log('Orden creada exitosamente, actualizando estados...');
          // Primero establecemos el mensaje y luego el éxito
          const successMessage = response.data.data.message || t.orderProcessing;
          console.log('Mensaje de éxito:', successMessage);
          
          setOrderMessage(successMessage);
          setSuccess(true);
          setProcessing(false);
          localStorage.removeItem('paymentProof');

          console.log('Estados actualizados, iniciando redirección...');
          setTimeout(() => {
            if (mounted.current) {
              console.log('Redirigiendo a la página principal...');
              navigate('/', { 
                state: { 
                  message: successMessage,
                  type: 'success'
                }
              });
            }
          }, 3000);
        } else {
          console.log('Error en la respuesta:', response.data.error);
          setProcessing(false);
          setError(response.data.error || t.orderError);
        }
      }
    } catch (error: unknown) {
      console.error('Error al crear orden:', error);
      console.error('Detalles del error:', {
        message: (error as any).message,
        response: (error as any).response?.data,
        status: (error as any).response?.status
      });
      
      if (mounted.current) {
        setProcessing(false);
        setError(
          ((error as any).response?.data?.error as string) || 
          t.orderError
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{t.confirmOrder}</h2>
      
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-[#051923] p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-900/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.orderSuccess}</h3>
              <div className="bg-[#051923] border border-gray-700 p-4 rounded-xl mb-4">
                <div className="text-left space-y-2">
                  <p className="text-gray-300"><span className="font-medium text-white">{t.fortniteUsername}:</span> {username}</p>
                  <p className="text-gray-300"><span className="font-medium text-white">{t.item}:</span> {item.displayName}</p>
                  <p className="text-gray-300"><span className="font-medium text-white">{t.price}:</span> {item.price.finalPrice} {t.vbucks}</p>
                  <p className="text-gray-300"><span className="font-medium text-white">{t.status}:</span> <span className="text-primary-400">{t.processing}</span></p>
                </div>
              </div>
              <p className="text-gray-300 mb-2">{orderMessage}</p>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-4">
                <div className="w-1/3 h-full bg-primary-600 animate-[progress_3s_ease-in-out_infinite]"></div>
              </div>
              <p className="text-gray-400 text-sm mt-4">{t.redirecting}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-[#051923] p-6 rounded-lg border border-gray-700 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{t.orderSummary}</h3>
          
          <div className="flex gap-4 items-start border-b border-gray-700 pb-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#051923]">
              <img 
                src={item.image} 
                alt={item.displayName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white">{item.displayName}</h4>
              <p className="text-sm text-gray-300">{t.fortniteUsername}: {username}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-white">{item.price.finalPrice} {t.vbucks}</p>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{t.total}</span>
              <span className="text-white">{item.price.finalPrice} {t.vbucks}</span>
            </div>
            <div className="flex justify-between font-medium text-lg mt-4">
              <span className="text-white">{t.total}</span>
              <span className="text-primary-400">{item.price.finalPrice} {t.vbucks}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <p className="text-gray-300 mb-6">
            {t.confirmOrder}
          </p>
          
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="px-4 py-2 text-gray-300 hover:text-white"
              disabled={processing}
            >
              {t.back}
            </button>
            
            <button
              onClick={handlePayment}
              disabled={processing}
              className={`px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                processing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.processing}</span>
                </>
              ) : (
                <span>{t.confirmOrder}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');
  const [paymentInfo, setPaymentInfo] = useState<{ paymentProof: File } | null>(null);
  const { items } = useCart();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];

  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!items.length) {
      navigate('/fortnite-shop');
    }

    if (user) {
      setUsername(user.username);
    }
  }, [items, navigate, user]);

  const handleContinueFromSummary = () => {
    setCurrentStep(isAuthenticated ? 2 : 2);
  };

  const handleContinueFromUser = (newUsername: string) => {
    setUsername(newUsername);
    setCurrentStep(3);
  };

  const handleContinueFromPayment = (info: { paymentProof: File }) => {
    setPaymentInfo(info);
    setCurrentStep(isAuthenticated ? 3 : 4);
  };

  const handleBackFromUser = () => {
    setCurrentStep(1);
  };

  const handleBackFromPayment = () => {
    setCurrentStep(isAuthenticated ? 1 : 2);
  };

  const handleBackFromConfirmation = () => {
    setCurrentStep(isAuthenticated ? 2 : 3);
  };

  if (!items.length) return null;

  return (
    <div className="min-h-screen bg-[#003554] pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <CheckoutSteps currentStep={currentStep} isAuthenticated={isAuthenticated} />
        {currentStep === 1 && (
          <OrderSummary item={items[0]} onContinue={handleContinueFromSummary} />
        )}
        {currentStep === 2 && !isAuthenticated && (
          <UserInformation onContinue={handleContinueFromUser} onBack={handleBackFromUser} />
        )}
        {(currentStep === 2 && isAuthenticated) && (
          <PaymentInformation onContinue={handleContinueFromPayment} onBack={handleBackFromUser} />
        )}
        {(currentStep === 3 && !isAuthenticated) && (
          <PaymentInformation onContinue={handleContinueFromPayment} onBack={handleBackFromPayment} />
        )}
        {((currentStep === 3 && isAuthenticated) || (currentStep === 4 && !isAuthenticated)) && (
          <Payment item={items[0]} username={username} onBack={handleBackFromConfirmation} />
        )}
      </div>
    </div>
  );
};

export default Checkout;
