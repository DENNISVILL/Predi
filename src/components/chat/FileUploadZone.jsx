/**
 * FileUploadZone - Drag & drop file upload with preview
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    X,
    FileText,
    Image as ImageIcon,
    File,
    CheckCircle
} from 'lucide-react';

const FileUploadZone = ({ onFileSelect, acceptedTypes = ['image/*', '.pdf', '.csv', '.xlsx'] }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        const validFiles = files.filter(file => {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name} es demasiado grande. Máximo 10MB`);
                return false;
            }
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);

        if (onFileSelect) {
            onFileSelect(validFiles);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return ImageIcon;
        if (file.type.includes('pdf')) return FileText;
        return File;
    };

    return (
        <div className="space-y-3">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragging ? 'text-cyan-400' : 'text-gray-500'
                    }`} />

                <p className="text-sm text-gray-300 font-medium mb-1">
                    {isDragging ? 'Suelta los archivos aquí' : 'Arrastra archivos o haz click'}
                </p>
                <p className="text-xs text-gray-500">
                    Imágenes, PDFs, CSV, Excel (máx 10MB)
                </p>
            </div>

            {/* Selected Files */}
            <AnimatePresence>
                {selectedFiles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {selectedFiles.map((file, index) => {
                            const FileIcon = getFileIcon(file);

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg"
                                >
                                    {/* Preview or Icon */}
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded bg-gray-700 flex items-center justify-center">
                                            <FileIcon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}

                                    {/* File Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>

                                    {/* Success Icon */}
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
                                    >
                                        <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUploadZone;
