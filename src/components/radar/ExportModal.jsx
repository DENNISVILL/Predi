/**
 * ExportModal - Modal for exporting trend data
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { exportToCSV, exportToJSON, exportHashtagPerformance, generateReport } from '../../utils/exportUtils';

const ExportModal = ({ isOpen, onClose, trends, hashtagPerformance, radarMetrics }) => {
    const [exportType, setExportType] = useState('csv');
    const [exportStatus, setExportStatus] = useState(null);
    const [includePerformance, setIncludePerformance] = useState(false);

    const handleExport = () => {
        setExportStatus({ type: 'loading', message: 'Exportando...' });

        setTimeout(() => {
            let result;

            if (exportType === 'csv') {
                result = exportToCSV(trends, 'radar-trends');
                if (includePerformance && hashtagPerformance?.length > 0) {
                    exportHashtagPerformance(hashtagPerformance, 'hashtag-performance');
                }
            } else if (exportType === 'json') {
                const report = generateReport(trends, radarMetrics);
                if (includePerformance) {
                    report.hashtagPerformance = hashtagPerformance;
                }
                result = exportToJSON(report, 'radar-report');
            }

            if (result.success) {
                setExportStatus({ type: 'success', message: result.message });
                setTimeout(() => {
                    onClose();
                    setExportStatus(null);
                }, 2000);
            } else {
                setExportStatus({ type: 'error', message: result.message });
            }
        }, 500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Download className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Exportar Datos</h3>
                                    <p className="text-gray-400 text-sm">Descarga tus análisis</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Export Type Selection */}
                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-semibold mb-3">
                                Formato de exportación
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setExportType('csv')}
                                    className={`p-4 rounded-lg border-2 transition-all ${exportType === 'csv'
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <FileText className={`w-8 h-8 mx-auto mb-2 ${exportType === 'csv' ? 'text-cyan-400' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-semibold ${exportType === 'csv' ? 'text-white' : 'text-gray-400'
                                        }`}>
                                        CSV
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Excel, Sheets
                                    </p>
                                </button>

                                <button
                                    onClick={() => setExportType('json')}
                                    className={`p-4 rounded-lg border-2 transition-all ${exportType === 'json'
                                            ? 'border-cyan-500 bg-cyan-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <Database className={`w-8 h-8 mx-auto mb-2 ${exportType === 'json' ? 'text-cyan-400' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm font-semibold ${exportType === 'json' ? 'text-white' : 'text-gray-400'
                                        }`}>
                                        JSON
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Reporte completo
                                    </p>
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="mb-6">
                            <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={includePerformance}
                                    onChange={(e) => setIncludePerformance(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500"
                                />
                                <div className="flex-1">
                                    <p className="text-white text-sm font-medium">Incluir Performance de Hashtags</p>
                                    <p className="text-gray-400 text-xs">Datos de rendimiento histórico</p>
                                </div>
                            </label>
                        </div>

                        {/* Summary */}
                        <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                            <p className="text-gray-300 text-sm mb-2">
                                <span className="font-semibold">Se exportarán:</span>
                            </p>
                            <ul className="text-gray-400 text-xs space-y-1">
                                <li>• {trends?.length || 0} trends detectados</li>
                                <li>• Métricas de crecimiento y engagement</li>
                                <li>• Distribución por plataforma y país</li>
                                {includePerformance && hashtagPerformance?.length > 0 && (
                                    <li>• {hashtagPerformance.length} hashtags con performance data</li>
                                )}
                            </ul>
                        </div>

                        {/* Status Message */}
                        <AnimatePresence>
                            {exportStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${exportStatus.type === 'success'
                                            ? 'bg-green-500/10 border border-green-500/30'
                                            : exportStatus.type === 'error'
                                                ? 'bg-red-500/10 border border-red-500/30'
                                                : 'bg-blue-500/10 border border-blue-500/30'
                                        }`}
                                >
                                    {exportStatus.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                    ) : exportStatus.type === 'error' ? (
                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                    ) : (
                                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                    )}
                                    <p className={`text-sm ${exportStatus.type === 'success'
                                            ? 'text-green-300'
                                            : exportStatus.type === 'error'
                                                ? 'text-red-300'
                                                : 'text-blue-300'
                                        }`}>
                                        {exportStatus.message}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={exportStatus?.type === 'loading'}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Exportar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExportModal;
