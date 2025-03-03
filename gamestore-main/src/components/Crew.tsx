import React, { useState } from 'react';
import { Crown, ShoppingCart, User, Coins, Trophy, Rocket, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const Crew = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const { language } = useLanguage();
  const t = translations[language];

  const plans = [
    {
      duration: 1,
      price: 25000,
      monthlyPrice: 25000,
      savings: 0,
      selected: true
    },
    {
      duration: 2,
      price: 44000,
      monthlyPrice: 22000,
      savings: 6000
    },
    {
      duration: 3,
      price: 60000,
      monthlyPrice: 20000,
      savings: 15000
    },
    {
      duration: 6,
      price: 105000,
      monthlyPrice: 17500,
      savings: 45000
    }
  ];

  return (
    <div className="min-h-screen bg-[#003554]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <div className="inline-block p-3 bg-primary-500/20 rounded-2xl mb-6">
              <Crown className="w-12 h-12 text-primary-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t.choosePlan}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t.joinCrewDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Planes */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Grid de Planes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan, index) => (
              <div 
                key={index}
                onClick={() => setSelectedPlan(index)}
                className="group cursor-pointer"
              >
                <div className={`relative bg-[#051923] rounded-2xl p-8 border transition-all duration-300 h-full shadow-lg
                  ${selectedPlan === index 
                    ? 'border-primary-400 shadow-xl scale-105' 
                    : 'border-primary-500/20 hover:border-primary-500/40'
                  }`}
                >
                  {selectedPlan === index && (
                    <div className="absolute -top-3 -right-3 bg-primary-500 text-white text-xs py-1 px-3 rounded-full">
                      {t.selected}
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {plan.duration} {plan.duration === 1 ? t.month : t.months}
                    </h3>
                    <div className="text-3xl font-bold text-primary-400 mt-2">
                      COP {plan.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      COP {plan.monthlyPrice.toLocaleString()} {t.perMonth}
                    </div>
                    {plan.savings > 0 && (
                      <div className="text-sm font-medium text-green-400 mt-2">
                        {t.youSave} COP {plan.savings.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-5 h-5 text-primary-400" />
                      <span>{t.exclusiveSkin}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Coins className="w-5 h-5 text-primary-400" />
                      <span>{t.monthlyVBucks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón de Compra */}
          <div className="text-center space-y-4">
            <button className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/20 flex items-center gap-2 mx-auto">
              <ShoppingCart className="w-5 h-5" />
              <span>{t.buyPlan} {plans[selectedPlan].duration} {plans[selectedPlan].duration === 1 ? t.month : t.months}</span>
            </button>
            <p className="text-sm text-gray-400">
              * {t.subscriptionNote}
            </p>
          </div>

          {/* Beneficios */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                {t.exclusiveBenefits}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                {t.joinCrewDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <User className="w-6 h-6" />,
                  title: t.exclusiveSkin,
                  description: t.joinCrewDescription
                },
                {
                  icon: <Coins className="w-6 h-6" />,
                  title: t.monthlyVBucks,
                  description: t.joinCrewDescription
                },
                {
                  icon: <Trophy className="w-6 h-6" />,
                  title: "Pase de Batalla Incluido",
                  description: "Accede al Pase de Batalla actual y futuros mientras seas miembro. ¡Desbloquea más de 100 recompensas cada temporada!"
                },
                {
                  icon: <Rocket className="w-6 h-6" />,
                  title: "Acceso Anticipado",
                  description: "Sé el primero en probar nuevas características y contenido exclusivo antes que nadie. ¡Vive Fortnite como nunca antes!"
                },
                {
                  icon: <Gift className="w-6 h-6" />,
                  title: "Recompensas Extra",
                  description: "Recibe objetos adicionales, emotes, pantallas de carga y más sorpresas cada mes. ¡Las recompensas nunca terminan!"
                },
                {
                  icon: <Sparkles className="w-6 h-6" />,
                  title: "Eventos Especiales",
                  description: "Participa en eventos exclusivos para miembros del Crew y obtén recompensas únicas. ¡No te pierdas ninguna aventura!"
                }
              ].map((benefit, index) => (
                <div key={index} className="group">
                  <div className="relative bg-[#051923] rounded-2xl p-6 border border-primary-500/20 shadow-lg transition-all duration-300 hover:border-primary-500/40 h-full">
                    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
                      <div className="text-primary-400">
                        {benefit.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crew;