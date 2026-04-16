/**
 * FEATURE #12: Licensing & Copyright Information
 * Complete licensing details with platform permissions and pricing
 */

import React, { useState } from 'react';
import type { ViralSong } from '../../types/music';
import { PLATFORM_NAMES, PLATFORM_ICONS } from '../../types/music';

interface LicensingInfoProps {
    song: ViralSong;
    className?: string;
}

const LicensingInfo: React.FC<LicensingInfoProps> = ({
    song,
    className = '',
}) => {
    const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'enterprise' | null>(null);

    const licensing = song.licensing;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high':
                return 'from-red-500 to-rose-500';
            case 'medium':
                return 'from-yellow-500 to-orange-500';
            case 'low':
                return 'from-green-500 to-emerald-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const getRiskLabel = (risk: string) => {
        switch (risk) {
            case 'high':
                return '🔴 ALTO RIESGO';
            case 'medium':
                return '🟡 RIESGO MEDIO';
            case 'low':
                return '🟢 RIESGO BAJO';
            default:
                return '⚪ DESCONOCIDO';
        }
    };

    return (
        <div className={`licensing-info ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-xl p-6">
                <h2 className="text-2xl font-bold mb-2">
                    <span className="mr-2">⚖️</span>
                    Licencias y Copyright
                </h2>
                <p className="text-orange-100">Información legal y permisos de uso</p>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6 space-y-6">
                {/* License Status Banner */}
                <div className={`rounded-xl p-6 border-4 ${licensing.isLicensed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
                    : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-500'
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">
                            {licensing.isLicensed ? '✅' : '⚠️'}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {licensing.isLicensed
                                    ? 'Licensed for Commercial Use'
                                    : 'License Required for Some Platforms'}
                            </h3>
                            <p className="text-gray-700">
                                {licensing.isLicensed
                                    ? 'Esta canción está licenciada y puedes usarla en todas las plataformas disponibles.'
                                    : 'Esta canción requiere licencia para uso comercial en algunas plataformas. Revisa los detalles abajo.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Platform Permissions Table */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">📱</span>
                        Permisos por Plataforma
                    </h3>

                    <div className="bg-white rounded-lg overflow-hidden border-2 border-blue-200">
                        {/* Table Header */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-blue-100 border-b-2 border-blue-200 font-bold text-gray-900">
                            <div>Plataforma</div>
                            <div>Uso Permitido</div>
                            <div>Monetización</div>
                            <div>Notas</div>
                        </div>

                        {/* Table Rows */}
                        {licensing.allowedPlatforms.map(platform => {
                            const isAllowed = licensing.allowedPlatforms.includes(platform);
                            const canMonetize = licensing.monetizationAllowed;

                            return (
                                <div key={platform} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-blue-50 transition-all">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{PLATFORM_ICONS[platform]}</span>
                                        <span className="font-semibold text-gray-900">{PLATFORM_NAMES[platform]}</span>
                                    </div>

                                    <div>
                                        {isAllowed ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                                ✅ Permitido
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                                ❌ Restringido
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        {canMonetize ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                                                💰 Sí
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                                🚫 No
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        {platform === 'youtube' && !canMonetize && 'Sin monetización'}
                                        {platform === 'tiktok' && isAllowed && 'Uso comercial OK'}
                                        {!isAllowed && 'Licencia requerida'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Copyright Strike Risk */}
                <div className={`bg-gradient-to-r ${getRiskColor(licensing.copyrightStrikeRisk || 'low')} text-white rounded-xl p-6`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl">
                            {licensing.copyrightStrikeRisk === 'high' ? '🚨' :
                                licensing.copyrightStrikeRisk === 'medium' ? '⚠️' : '✅'}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-1">
                                {getRiskLabel(licensing.copyrightStrikeRisk || 'low')}
                            </h3>
                            <p className="text-white text-opacity-90">
                                {licensing.copyrightStrikeRisk === 'high'
                                    ? 'ALTA probabilidad de copyright strike en YouTube. Usa alternativas o compra licencia.'
                                    : licensing.copyrightStrikeRisk === 'medium'
                                        ? 'Riesgo moderado de copyright strike. Procede con precaución.'
                                        : 'Bajo riesgo de copyright strike. Puedes usar con confianza.'}
                            </p>
                        </div>
                    </div>

                    {licensing.copyrightStrikeRisk === 'high' && (
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="font-semibold mb-2">⚠️ Recomendaciones:</div>
                            <ul className="space-y-1 text-sm">
                                <li>• Evita monetizar videos con esta canción en YouTube</li>
                                <li>• Considera usar canciones alternativas similares</li>
                                <li>• Compra licencia premium para uso seguro</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Licensing Pricing Tiers */}
                {licensing.cost && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">💳</span>
                            Planes de Licencia
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Basic Tier */}
                            <div className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${selectedTier === 'basic'
                                ? 'border-purple-500 shadow-lg'
                                : 'border-gray-200 hover:border-purple-300'
                                }`}
                                onClick={() => setSelectedTier('basic')}>
                                <div className="text-center mb-4">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">BASIC</div>
                                    <div className="text-4xl font-bold text-purple-600 mb-1">${licensing.cost.amount}</div>
                                    <div className="text-sm text-gray-600">/{licensing.cost.period}</div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>TikTok & Instagram</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>100 videos/mes</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Atribución requerida</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-red-500">✗</span>
                                        <span>No YouTube monetization</span>
                                    </div>
                                </div>

                                <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all">
                                    Seleccionar
                                </button>
                            </div>

                            {/* Premium Tier - RECOMMENDED */}
                            <div className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer relative ${selectedTier === 'premium'
                                ? 'border-orange-500 shadow-lg'
                                : 'border-orange-300 hover:border-orange-400'
                                }`}
                                onClick={() => setSelectedTier('premium')}>
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                                    RECOMENDADO
                                </div>

                                <div className="text-center mb-4 mt-2">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">PREMIUM</div>
                                    <div className="text-4xl font-bold text-orange-600 mb-1">$49.99</div>
                                    <div className="text-sm text-gray-600">/month</div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>TODAS las plataformas</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Videos ILIMITADOS</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>YouTube monetization</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Sin atribución</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Soporte prioritario</span>
                                    </div>
                                </div>

                                <button className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-all">
                                    Seleccionar
                                </button>
                            </div>

                            {/* Enterprise Tier */}
                            <div className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${selectedTier === 'enterprise'
                                ? 'border-blue-500 shadow-lg'
                                : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedTier('enterprise')}>
                                <div className="text-center mb-4">
                                    <div className="text-sm font-semibold text-gray-600 mb-1">ENTERPRISE</div>
                                    <div className="text-4xl font-bold text-blue-600 mb-1">$199</div>
                                    <div className="text-sm text-gray-600">/year</div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Todo en Premium</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Múltiples usuarios</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>White-label rights</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Licencia custom</span>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <span className="text-green-500">✓</span>
                                        <span>Account manager dedicado</span>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                                    Contactar Ventas
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms & Conditions */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        <span className="mr-2">📄</span>
                        Términos y Condiciones
                    </h3>

                    <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Derechos de Autor</h4>
                            <p className="text-sm text-gray-700">
                                Esta canción está protegida por derechos de autor. El uso no autorizado puede resultar en
                                reclamaciones de copyright, eliminación de contenido o acciones legales.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Uso Permitido</h4>
                            <p className="text-sm text-gray-700">
                                Con la licencia adecuada, puedes usar esta canción en contenido de redes sociales, videos
                                comerciales, y proyectos publicitarios según los términos de tu plan.
                            </p>
                        </div>

                        {licensing.termsUrl && (
                            <a
                                href={licensing.termsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                            >
                                📄 Ver Términos y Condiciones Completos →
                            </a>
                        )}
                    </div>
                </div>

                {/* Alternative Songs (if unlicensed or high risk) */}
                {(licensing.copyrightStrikeRisk === 'high' || !licensing.isLicensed) && licensing.alternatives && (
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <span className="mr-2">🎵</span>
                            Canciones Alternativas Similares
                        </h3>

                        <p className="text-gray-700 mb-4">
                            Estas canciones tienen vibe similar pero con mejores términos de licencia:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {licensing.alternatives.map((altId, index) => (
                                <div key={altId} className="bg-white rounded-lg p-4 border-2 border-pink-200 hover:border-pink-400 transition-all cursor-pointer">
                                    <div className="text-center mb-3">
                                        <div className="text-4xl mb-2">🎵</div>
                                        <div className="font-bold text-gray-900">Alternative Song #{index + 1}</div>
                                        <div className="text-xs text-gray-600">Song ID: {altId}</div>
                                    </div>

                                    <div className="space-y-2 mb-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Viral Score:</span>
                                            <span className="font-bold text-purple-600">85</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">License:</span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                ✅ Free
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Risk:</span>
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                Low
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full bg-pink-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-all">
                                        Usar Esta Instead
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border-2 border-blue-300">
                        <div className="text-2xl mb-1">📱</div>
                        <div className="text-sm text-gray-600">Plataformas</div>
                        <div className="text-xl font-bold text-blue-600">{licensing.allowedPlatforms.length}</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border-2 border-green-300">
                        <div className="text-2xl mb-1">💰</div>
                        <div className="text-sm text-gray-600">Monetización</div>
                        <div className="text-xl font-bold text-green-600">
                            {licensing.monetizationAllowed ? 'Sí' : 'No'}
                        </div>
                    </div>

                    <div className={`bg-gradient-to-br rounded-lg p-4 text-center border-2 ${licensing.copyrightStrikeRisk === 'low'
                        ? 'from-green-50 to-green-100 border-green-300'
                        : licensing.copyrightStrikeRisk === 'medium'
                            ? 'from-yellow-50 to-yellow-100 border-yellow-300'
                            : 'from-red-50 to-red-100 border-red-300'
                        }`}>
                        <div className="text-2xl mb-1">⚠️</div>
                        <div className="text-sm text-gray-600">Riesgo</div>
                        <div className={`text-xl font-bold capitalize ${licensing.copyrightStrikeRisk === 'low' ? 'text-green-600' :
                            licensing.copyrightStrikeRisk === 'medium' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {licensing.copyrightStrikeRisk || 'Low'}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center border-2 border-purple-300">
                        <div className="text-2xl mb-1">💳</div>
                        <div className="text-sm text-gray-600">Precio</div>
                        <div className="text-xl font-bold text-purple-600">
                            {licensing.cost ? `$${licensing.cost.amount}` : 'Free'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicensingInfo;
