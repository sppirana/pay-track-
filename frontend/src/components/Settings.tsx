import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Lock, Store, Pencil, X } from 'lucide-react';

export default function Settings() {
    const { shopSettings, updateShopSettings, adminPassword, updateAdminPassword } = useApp();

    const [settingsForm, setSettingsForm] = useState(shopSettings);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateShopSettings(settingsForm);
        setIsEditing(false);
        setStatus({ type: 'success', message: 'Shop settings updated successfully!' });
        setTimeout(() => setStatus(null), 3000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.currentPassword !== adminPassword) {
            setStatus({ type: 'error', message: 'Incorrect current password' });
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }
        if (passwordForm.newPassword.length < 4) {
            setStatus({ type: 'error', message: 'Password must be at least 4 characters' });
            return;
        }

        updateAdminPassword(passwordForm.newPassword);
        setIsEditingPassword(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setStatus({ type: 'success', message: 'Password changed successfully!' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h2>

            {status && (
                <div className={`mb-6 p-4 rounded-lg border ${status.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-900'
                    : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-900'
                    }`}>
                    {status.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shop Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Shop Details</h3>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Edit Details"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {!isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shop Name</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">{shopSettings.name}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{shopSettings.address}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Contact Number</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white">{shopSettings.contact}</div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSettingsSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Shop Name
                                </label>
                                <input
                                    type="text"
                                    value={settingsForm.name}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={settingsForm.address}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={settingsForm.contact}
                                    onChange={(e) => setSettingsForm({ ...settingsForm, contact: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSettingsForm(shopSettings);
                                    }}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Security Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Security</h3>
                        </div>
                        {!isEditingPassword && (
                            <button
                                onClick={() => setIsEditingPassword(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Change Password"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {!isEditingPassword ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Admin Access</label>
                                <div className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                    <span className="text-2xl tracking-widest mt-1">••••••••</span>
                                    <span className="ml-3 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">Secured</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Password protected. Click edit to change.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center font-medium"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditingPassword(false);
                                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    }}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

        </div>
    );
}
