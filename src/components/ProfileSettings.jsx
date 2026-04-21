import { useState } from 'react';
import { User, ShieldCheck, Settings, ArrowLeft, LogOut, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/auth';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings({ onBackToDashboard }) {
    const { user, logout, deleteAccount, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('account');

    // Account tab state
    const [email, setEmail] = useState(user?.email || '');
    const [displayName, setDisplayName] = useState(user?.displayName || user?.email?.split('@')[0] || '');
    const [accountMessage, setAccountMessage] = useState(null);
    const [savingAccount, setSavingAccount] = useState(false);

    // Security tab state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityMessage, setSecurityMessage] = useState(null);
    const [saving, setSaving] = useState(false);

    // Delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const handleSaveAccount = async () => {
        setAccountMessage(null);
        if (!email.trim()) {
            setAccountMessage({ type: 'error', text: 'Email is required' });
            return;
        }

        setSavingAccount(true);
        try {
            await updateProfile(email.trim(), displayName.trim());
            setAccountMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error) {
            setAccountMessage({ type: 'error', text: error.message });
        } finally {
            setSavingAccount(false);
        }
    };

    const handleChangePassword = async () => {
        setSecurityMessage(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setSecurityMessage({ type: 'error', text: 'All fields are required' });
            return;
        }
        if (newPassword.length < 6) {
            setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setSecurityMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setSaving(true);
        try {
            await changePassword(currentPassword, newPassword);
            setSecurityMessage({ type: 'success', text: 'Password updated successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setSecurityMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            setDeleteError('Password is required');
            return;
        }

        setDeleting(true);
        setDeleteError('');
        try {
            await deleteAccount(deletePassword);
        } catch (error) {
            setDeleteError(error.message);
            setDeleting(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'preferences', label: 'Preferences', icon: Settings },
    ];

    return (
        <main className={styles.mainView}>
            <div className={styles.settingsCard}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Profile Settings</h1>
                        <p className={styles.subtitle}>Manage your personal account information and preferences</p>
                    </div>
                    <button className={styles.backLink} onClick={onBackToDashboard}>
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                </div>

                <div className={styles.content}>
                    <div className={styles.tabList}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === 'account' && (
                            <div className={styles.tabPanel}>
                                <div className={styles.field}>
                                    <label className={styles.label}>Email</label>
                                    <input
                                        className={styles.input}
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Display Name</label>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        value={displayName}
                                        onChange={e => setDisplayName(e.target.value)}
                                        placeholder="Enter your display name"
                                    />
                                </div>
                                {accountMessage && (
                                    <p className={accountMessage.type === 'error' ? styles.errorMsg : styles.successMsg}>
                                        {accountMessage.text}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className={styles.tabPanel}>
                                <h3 className={styles.sectionTitle}>Change Password</h3>
                                <div className={styles.field}>
                                    <label className={styles.label}>Current Password</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>New Password</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label className={styles.label}>Confirm New Password</label>
                                    <input
                                        className={styles.input}
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                {securityMessage && (
                                    <p className={securityMessage.type === 'error' ? styles.errorMsg : styles.successMsg}>
                                        {securityMessage.text}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className={styles.tabPanel}>
                                <p className={styles.comingSoon}>Preferences coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <button className={styles.logoutButton} onClick={logout}>
                        <LogOut size={16} />
                        Log Out
                    </button>
                    <button className={styles.deleteButton} onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 size={16} />
                        Delete Account
                    </button>
                    {activeTab === 'account' && (
                        <button className={styles.saveButton} onClick={handleSaveAccount} disabled={savingAccount}>
                            <Check size={16} />
                            {savingAccount ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                    {activeTab === 'security' && (
                        <button className={styles.saveButton} onClick={handleChangePassword} disabled={saving}>
                            <Check size={16} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>

            {showDeleteConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Delete Account</h3>
                        <p>This action is permanent. All your notes will be deleted. Enter your password to confirm.</p>
                        <input
                            className={styles.input}
                            type="password"
                            value={deletePassword}
                            onChange={e => setDeletePassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                        {deleteError && <p className={styles.errorMsg}>{deleteError}</p>}
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
