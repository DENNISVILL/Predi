import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Download, Copy, Check, AlertTriangle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Two-Factor Authentication Setup Component
 * Enterprise-grade 2FA with TOTP and backup codes
 */
const TwoFactorAuth = ({ onClose }) => {
    const [step, setStep] = useState('status'); // status, setup, verify, codes
    const [qrCode, setQrCode] = useState('');
    const [secret, setSecret] = useState('');
    const [backupCodes, setBackupCodes] = useState([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Check 2FA status on mount
    useEffect(() => {
        check2FAStatus();
    }, []);

    const check2FAStatus = async () => {
        try {
            const response = await fetch('/api/v1/2fa/status', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setIs2FAEnabled(data.enabled);
        } catch (error) {
            console.error('Error checking 2FA status:', error);
        }
    };

    const handleSetup2FA = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/2fa/setup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to setup 2FA');
            }

            const data = await response.json();
            setQrCode(data.qr_code);
            setSecret(data.secret);
            setBackupCodes(data.backup_codes);
            setStep('setup');
            toast.success('2FA setup initiated');
        } catch (error) {
            toast.error('Error setting up 2FA: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/2fa/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: verificationCode })
            });

            if (!response.ok) {
                throw new Error('Invalid verification code');
            }

            setStep('codes');
            setIs2FAEnabled(true);
            toast.success('2FA enabled successfully!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
            return;
        }

        setLoading(true);
        try {
            const password = prompt('Enter your password to confirm:');
            if (!password) return;

            const response = await fetch('/api/v1/2fa/disable', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                throw new Error('Failed to disable 2FA');
            }

            setIs2FAEnabled(false);
            setStep('status');
            toast.success('2FA disabled');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateCodes = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/v1/2fa/regenerate-codes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate codes');
            }

            const data = await response.json();
            setBackupCodes(data.backup_codes);
            toast.success('Backup codes regenerated');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadBackupCodes = () => {
        const text = backupCodes.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'predix-backup-codes.txt';
        a.click();
        toast.success('Backup codes downloaded');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#1f1f1f] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#1f1f1f] border-b border-gray-700 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
                            <p className="text-sm text-gray-400">Add an extra layer of security</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {/* Status View */}
                        {step === 'status' && (
                            <motion.div
                                key="status"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                {is2FAEnabled ? (
                                    <div className="space-y-6">
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Check className="w-6 h-6 text-green-500" />
                                                <h3 className="text-xl font-bold text-white">2FA is Enabled</h3>
                                            </div>
                                            <p className="text-gray-300">
                                                Your account is protected with two-factor authentication.
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            <button
                                                onClick={handleRegenerateCodes}
                                                disabled={loading}
                                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Key className="w-5 h-5" />
                                                Regenerate Backup Codes
                                            </button>

                                            <button
                                                onClick={handleDisable2FA}
                                                disabled={loading}
                                                className="w-full py-3 px-4 bg-red-500/20 hover:bg-red-500/30 disabled:bg-gray-600 border border-red-500/50 rounded-xl text-red-400 font-medium transition-colors"
                                            >
                                                Disable 2FA
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                                                <h3 className="text-xl font-bold text-white">2FA is Not Enabled</h3>
                                            </div>
                                            <p className="text-gray-300 mb-4">
                                                Protect your account with an additional security layer. Recommended for all enterprise users.
                                            </p>
                                            <ul className="space-y-2 text-gray-400">
                                                <li className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                    Prevent unauthorized access
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                    Secure even if password is compromised
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                    Industry standard for enterprise security
                                                </li>
                                            </ul>
                                        </div>

                                        <button
                                            onClick={handleSetup2FA}
                                            disabled={loading}
                                            className="w-full py-4 px-6 bg-gradient-to-r from-[#007bff] to-[#00ff9d] hover:opacity-90 disabled:opacity-50 rounded-xl text-white font-bold text-lg transition-all"
                                        >
                                            {loading ? 'Setting up...' : 'Enable 2FA'}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Setup View - QR Code */}
                        {step === 'setup' && (
                            <motion.div
                                key="setup"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-white mb-2">Scan QR Code</h3>
                                    <p className="text-gray-400">
                                        Use Google Authenticator, Authy, or any TOTP app
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="flex justify-center">
                                    <div className="bg-white p-4 rounded-xl">
                                        <img src={qrCode} alt="2FA QR Code" className="w-64 h-64" />
                                    </div>
                                </div>

                                {/* Manual Entry */}
                                <div className="bg-[#2a2a2a] rounded-xl p-4">
                                    <p className="text-sm text-gray-400 mb-2">Can't scan? Enter manually:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-black/30 px-4 py-2 rounded-lg text-white font-mono text-sm">
                                            {secret}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(secret)}
                                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                        >
                                            {copied ? <Check className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep('verify')}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white font-medium"
                                >
                                    Next: Verify Code
                                </button>
                            </motion.div>
                        )}

                        {/* Verify View */}
                        {step === 'verify' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <Smartphone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Enter Verification Code</h3>
                                    <p className="text-gray-400">
                                        Enter the 6-digit code from your authenticator app
                                    </p>
                                </div>

                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    className="w-full px-6 py-4 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white text-center text-2xl font-mono tracking-wider focus:outline-none focus:border-blue-500"
                                    maxLength={6}
                                    autoFocus
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setStep('setup')}
                                        className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleVerify2FA}
                                        disabled={verificationCode.length !== 6 || loading}
                                        className="py-3 px-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] hover:opacity-90 disabled:opacity-50 rounded-xl text-white font-medium transition-all"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Enable'}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Backup Codes View */}
                        {step === 'codes' && (
                            <motion.div
                                key="codes"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Check className="w-6 h-6 text-green-500" />
                                        <h3 className="text-xl font-bold text-white">2FA Enabled Successfully!</h3>
                                    </div>
                                    <p className="text-gray-300">
                                        Save these backup codes in a secure location. You can use them to access your account if you lose your phone.
                                    </p>
                                </div>

                                <div className="bg-[#2a2a2a] rounded-xl p-6">
                                    <h4 className="text-lg font-bold text-white mb-4">Backup Codes</h4>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {backupCodes.map((code, index) => (
                                            <div
                                                key={index}
                                                className="bg-black/30 px-4 py-2 rounded-lg text-white font-mono text-center"
                                            >
                                                {code}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => copyToClipboard(backupCodes.join('\n'))}
                                            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copy All
                                        </button>
                                        <button
                                            onClick={downloadBackupCodes}
                                            className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setStep('status');
                                        onClose && onClose();
                                    }}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#007bff] to-[#00ff9d] rounded-xl text-white font-medium"
                                >
                                    Done
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TwoFactorAuth;
