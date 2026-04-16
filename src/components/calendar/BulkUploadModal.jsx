/**
 * BulkUploadModal - Upload multiple posts via CSV
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { parse } from 'papaparse';

const BulkUploadModal = ({ isOpen, onClose, onImport }) => {
    const [csvData, setCsvData] = useState(null);
    const [parsedPosts, setParsedPosts] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [importing, setImporting] = useState(false);

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            processFile(file);
        } else {
            setErrors(['Por favor sube un archivo CSV válido']);
        }
    }, []);

    // Handle file input
    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    // Process CSV file
    const processFile = (file) => {
        parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const { data, errors: parseErrors } = results;

                if (parseErrors.length > 0) {
                    setErrors(parseErrors.map(e => e.message));
                    return;
                }

                // Validate and transform data
                const validatedPosts = [];
                const validationErrors = [];

                data.forEach((row, index) => {
                    const errors = validatePost(row, index + 1);
                    if (errors.length > 0) {
                        validationErrors.push(...errors);
                    } else {
                        validatedPosts.push(transformPost(row));
                    }
                });

                setParsedPosts(validatedPosts);
                setErrors(validationErrors);
                setCsvData(data);
            },
            error: (error) => {
                setErrors([error.message]);
            }
        });
    };

    // Validate post data
    const validatePost = (post, rowNumber) => {
        const errors = [];

        if (!post.date) errors.push(`Fila ${rowNumber}: Falta la fecha`);
        if (!post.time) errors.push(`Fila ${rowNumber}: Falta la hora`);
        if (!post.platform) errors.push(`Fila ${rowNumber}: Falta la plataforma`);
        if (!post.content && !post.title) errors.push(`Fila ${rowNumber}: Falta contenido o título`);

        // Validate date format
        if (post.date && isNaN(new Date(post.date))) {
            errors.push(`Fila ${rowNumber}: Formato de fecha inválido`);
        }

        // Validate platform
        const validPlatforms = ['tiktok', 'instagram', 'youtube', 'facebook', 'linkedin'];
        if (post.platform && !validPlatforms.includes(post.platform.toLowerCase())) {
            errors.push(`Fila ${rowNumber}: Plataforma inválida (usa: ${validPlatforms.join(', ')})`);
        }

        return errors;
    };

    // Transform CSV row to post object
    const transformPost = (row) => {
        const [hours, minutes] = (row.time || '12:00').split(':');
        const scheduledDate = new Date(row.date);
        scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return {
            id: `import_${Date.now()}_${Math.random()}`,
            title: row.title || row.content?.substring(0, 50),
            content: row.content || '',
            description: row.content || '',
            platform: row.platform.toLowerCase(),
            scheduledDate,
            date: scheduledDate,
            hashtags: row.hashtags || '',
            niche: row.niche || 'general',
            status: 'pending',
            viralScore: Math.floor(Math.random() * 40 + 50), // Random score 50-90
            notes: row.notes || '',
            priority: row.priority || 'medium',
            type: 'bulk-import'
        };
    };

    // Handle import
    const handleImport = async () => {
        setImporting(true);
        try {
            await onImport(parsedPosts);
            setTimeout(() => {
                setImporting(false);
                onClose();
                // Reset state
                setCsvData(null);
                setParsedPosts([]);
                setErrors([]);
            }, 1000);
        } catch (error) {
            setErrors([error.message]);
            setImporting(false);
        }
    };

    // Download template
    const downloadTemplate = () => {
        const template = `date,time,platform,title,content,hashtags,niche,notes,priority
2025-01-15,19:00,tiktok,Video Fitness,Rutina de gimnasio para principiantes,#fitness #gym #workout,fitness,Usar música trending,high
2025-01-16,12:00,instagram,Receta Saludable,Bowl de açai con granola casera,#healthy #food #breakfast,food,Incluir foto del proceso,medium
2025-01-17,20:00,youtube,Tutorial Tech,Como configurar tu setup de trabajo,#tech #productivity #setup,tech,Video de 10 minutos,high`;

        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bulk_posts_template.csv';
        a.click();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-gray-900 rounded-2xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <Upload className="w-6 h-6 text-cyan-400" />
                                    <h2 className="text-xl font-bold text-white">Importar Posts en Masa</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                {!csvData ? (
                                    <div className="space-y-6">
                                        {/* Download Template Button */}
                                        <div className="flex justify-center">
                                            <button
                                                onClick={downloadTemplate}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                                Descargar Template CSV
                                            </button>
                                        </div>

                                        {/* Drop Zone */}
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setIsDragging(true);
                                            }}
                                            onDragLeave={() => setIsDragging(false)}
                                            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging
                                                    ? 'border-cyan-400 bg-cyan-400/10'
                                                    : 'border-gray-700 hover:border-gray-600'
                                                }`}
                                        >
                                            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                                            <p className="text-white font-semibold mb-2">
                                                Arrastra tu archivo CSV aquí
                                            </p>
                                            <p className="text-gray-400 text-sm mb-4">o</p>
                                            <label className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg cursor-pointer transition-colors">
                                                Seleccionar Archivo
                                                <input
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleFileInput}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>

                                        {/* Instructions */}
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                            <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                Formato del CSV
                                            </h3>
                                            <ul className="text-sm text-gray-300 space-y-1 ml-7">
                                                <li>• Columnas requeridas: date, time, platform, content</li>
                                                <li>• Formato fecha: YYYY-MM-DD (ej: 2025-01-15)</li>
                                                <li>• Formato hora: HH:MM (ej: 19:00)</li>
                                                <li>• Plataformas válidas: tiktok, instagram, youtube, facebook, linkedin</li>
                                                <li>• Usa el template descargable como guía</li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Errors */}
                                        {errors.length > 0 && (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                                <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                                                    <AlertCircle className="w-5 h-5" />
                                                    Errores encontrados ({errors.length})
                                                </h3>
                                                <ul className="text-sm text-gray-300 space-y-1">
                                                    {errors.slice(0, 5).map((error, index) => (
                                                        <li key={index}>• {error}</li>
                                                    ))}
                                                    {errors.length > 5 && (
                                                        <li className="text-gray-400">... y {errors.length - 5} más</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Success */}
                                        {parsedPosts.length > 0 && (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                                <h3 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5" />
                                                    Posts válidos: {parsedPosts.length}
                                                </h3>
                                                <p className="text-sm text-gray-300">
                                                    Listos para importar al calendario
                                                </p>
                                            </div>
                                        )}

                                        {/* Preview Table */}
                                        {parsedPosts.length > 0 && (
                                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                                                <div className="overflow-x-auto max-h-96">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-800 text-gray-300">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left">Fecha</th>
                                                                <th className="px-4 py-3 text-left">Plataforma</th>
                                                                <th className="px-4 py-3 text-left">Título</th>
                                                                <th className="px-4 py-3 text-left">Hashtags</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-300">
                                                            {parsedPosts.slice(0, 10).map((post, index) => (
                                                                <tr key={index} className="border-t border-gray-700">
                                                                    <td className="px-4 py-3">
                                                                        {new Date(post.scheduledDate).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-4 py-3 capitalize">{post.platform}</td>
                                                                    <td className="px-4 py-3">{post.title}</td>
                                                                    <td className="px-4 py-3 text-xs">{post.hashtags}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between p-6 border-t border-gray-700">
                                <button
                                    onClick={() => {
                                        setCsvData(null);
                                        setParsedPosts([]);
                                        setErrors([]);
                                    }}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    disabled={!csvData}
                                >
                                    Limpiar
                                </button>
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={parsedPosts.length === 0 || importing}
                                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {importing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Importando...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Importar {parsedPosts.length} Posts
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BulkUploadModal;
