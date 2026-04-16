/**
 * ConversationList - Display and manage conversation list in sidebar
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Pin,
    Archive,
    Trash2,
    Edit2,
    Check,
    X,
    MoreVertical,
    MessageSquare,
    Plus
} from 'lucide-react';
import conversationManager from '../../utils/conversationManager';

// Conversation Group Component
const ConversationGroup = React.forwardRef(({
    title,
    conversations,
    activeConversationId,
    onSelectConversation,
    editingId,
    editTitle,
    setEditTitle,
    handleRename,
    setEditingId,
    contextMenuId,
    setContextMenuId,
    startEdit,
    handlePin,
    handleArchive,
    handleDelete
}, ref) => {
    return (
        <div ref={ref} className="mb-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {title}
            </div>
            <div className="space-y-1 px-2">
                {conversations.map(conv => (
                    <ConversationItem
                        key={conv.id}
                        conversation={conv}
                        isActive={conv.id === activeConversationId}
                        onClick={() => onSelectConversation(conv)}
                        isEditing={editingId === conv.id}
                        editTitle={editTitle}
                        setEditTitle={setEditTitle}
                        onSaveEdit={() => handleRename(conv.id)}
                        onCancelEdit={() => setEditingId(null)}
                        showContextMenu={contextMenuId === conv.id}
                        onToggleContextMenu={() => setContextMenuId(contextMenuId === conv.id ? null : conv.id)}
                        onEdit={() => startEdit(conv)}
                        onPin={() => handlePin(conv.id)}
                        onArchive={() => handleArchive(conv.id)}
                        onDelete={() => handleDelete(conv.id)}
                    />
                ))}
            </div>
        </div>
    );
});

// Conversation Item Component
const ConversationItem = ({
    conversation,
    isActive,
    onClick,
    isEditing,
    editTitle,
    setEditTitle,
    onSaveEdit,
    onCancelEdit,
    showContextMenu,
    onToggleContextMenu,
    onEdit,
    onPin,
    onArchive,
    onDelete
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative group"
        >
            <div
                onClick={!isEditing ? onClick : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer transition-all duration-200 text-sm border border-transparent ${isActive
                    ? 'bg-[#26282b] text-white font-medium border-gray-800/50 shadow-sm'
                    : 'text-gray-400 hover:bg-[#1e1f20] hover:text-gray-200'
                    }`}
            >
                {/* Removed blue dot, using background hint instead */}
                {/* <div className={`w-1 h-4 rounded-full ${isActive ? 'bg-cyan-500' : 'bg-transparent'}`} /> */}

                {/* Icon removed or simplified if desired, kept for now but could be removed for pure text look */}
                {/* <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-70" /> */}

                {isEditing ? (
                    <div className="flex items-center gap-2 flex-1">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSaveEdit();
                                if (e.key === 'Escape') onCancelEdit();
                            }}
                            className="flex-1 px-2 py-1 bg-[#1e1f20] text-gray-200 rounded text-sm focus:outline-none border border-gray-700"
                            autoFocus
                        />
                        <button
                            onClick={onSaveEdit}
                            className="p-1 hover:bg-gray-700 rounded text-green-400"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={onCancelEdit}
                            className="p-1 hover:bg-gray-700 rounded text-gray-400"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <>
                        <span className={`truncate flex-1 text-sm ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                            {conversation.title}
                        </span>

                        {conversation.isPinned && (
                            <Pin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        )}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleContextMenu();
                            }}
                            className={`p-1 rounded transition-opacity ${isActive ? 'opacity-100 text-gray-400 hover:text-white' : 'opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white'}`}
                        >
                            <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}
            </div>

            {/* Context Menu */}
            <AnimatePresence>
                {showContextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 py-1"
                    >
                        <button
                            onClick={onEdit}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Renombrar
                        </button>
                        <button
                            onClick={onPin}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <Pin className="w-4 h-4" />
                            {conversation.isPinned ? 'Desfijar' : 'Fijar'}
                        </button>
                        <button
                            onClick={onArchive}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <Archive className="w-4 h-4" />
                            {conversation.isArchived ? 'Desarchivar' : 'Archivar'}
                        </button>
                        <div className="border-t border-gray-700 my-1" />
                        <button
                            onClick={onDelete}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ConversationList = ({ onSelectConversation, activeConversationId, onNewChat }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState(conversationManager.getAllConversations());
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [contextMenuId, setContextMenuId] = useState(null);

    // Filter and group conversations
    const filteredConversations = useMemo(() => {
        let filtered = searchQuery
            ? conversationManager.searchConversations(searchQuery)
            : conversations;

        if (!showArchived) {
            filtered = filtered.filter(conv => !conv.isArchived);
        }

        return conversationManager.groupByDate(filtered);
    }, [conversations, searchQuery, showArchived]);

    const refreshConversations = () => {
        setConversations(conversationManager.getAllConversations());
    };

    const handleRename = (id) => {
        if (editTitle.trim()) {
            conversationManager.renameConversation(id, editTitle);
            refreshConversations();
        }
        setEditingId(null);
        setEditTitle('');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Eliminar esta conversación?')) {
            conversationManager.deleteConversation(id);
            refreshConversations();
            setContextMenuId(null);
        }
    };

    const handlePin = (id) => {
        conversationManager.pinConversation(id);
        refreshConversations();
        setContextMenuId(null);
    };

    const handleArchive = (id) => {
        conversationManager.archiveConversation(id);
        refreshConversations();
        setContextMenuId(null);
    };

    const startEdit = (conv) => {
        setEditingId(conv.id);
        setEditTitle(conv.title);
        setContextMenuId(null);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search Bar - Redesigned */}
            <div className="p-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar..."
                        className="w-full pl-10 pr-4 py-2 bg-transparent text-gray-300 text-sm placeholder-gray-600 focus:outline-none focus:ring-0 transition-all border-b border-gray-800 focus:border-gray-600"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {/* Pinned */}
                    {filteredConversations.pinned.length > 0 && (
                        <ConversationGroup
                            key="pinned"
                            title="Fijadas"
                            conversations={filteredConversations.pinned}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Today */}
                    {filteredConversations.today.length > 0 && (
                        <ConversationGroup
                            key="today"
                            title="Hoy"
                            conversations={filteredConversations.today}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Yesterday */}
                    {filteredConversations.yesterday.length > 0 && (
                        <ConversationGroup
                            key="yesterday"
                            title="Ayer"
                            conversations={filteredConversations.yesterday}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Last 7 Days */}
                    {filteredConversations.last7Days.length > 0 && (
                        <ConversationGroup
                            key="last7Days"
                            title="Últimos 7 días"
                            conversations={filteredConversations.last7Days}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Last 30 Days */}
                    {filteredConversations.last30Days.length > 0 && (
                        <ConversationGroup
                            key="last30Days"
                            title="Últimos 30 días"
                            conversations={filteredConversations.last30Days}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}

                    {/* Older */}
                    {filteredConversations.older.length > 0 && (
                        <ConversationGroup
                            key="older"
                            title="Más antiguas"
                            conversations={filteredConversations.older}
                            activeConversationId={activeConversationId}
                            onSelectConversation={onSelectConversation}
                            editingId={editingId}
                            editTitle={editTitle}
                            setEditTitle={setEditTitle}
                            handleRename={handleRename}
                            setEditingId={setEditingId}
                            contextMenuId={contextMenuId}
                            setContextMenuId={setContextMenuId}
                            startEdit={startEdit}
                            handlePin={handlePin}
                            handleArchive={handleArchive}
                            handleDelete={handleDelete}
                        />
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {conversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <MessageSquare className="w-12 h-12 text-gray-600 mb-4" />
                        <h3 className="text-gray-400 font-medium mb-2">Sin conversaciones</h3>
                        <p className="text-gray-500 text-sm">Comienza un nuevo chat para empezar</p>
                    </div>
                )}
            </div>

            {/* Sidebar Footer (Profile & Actions) - Redesigned */}
            <div className="p-4 mt-auto">
                <div className="flex items-center gap-3 group cursor-pointer hover:bg-[#1e1f20] p-2 rounded-xl transition-all duration-200">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm">
                        PA
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">Predix Admin</div>
                        <div className="text-xs text-gray-500">Plan Enterprise</div>
                    </div>
                    {/* Settings Cog could go here */}
                </div>

                <div className="flex gap-1 mt-2">
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all ${showArchived
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'text-gray-500 hover:bg-[#1e1f20] hover:text-gray-300'
                            }`}
                    >
                        <Archive className="w-3.5 h-3.5" />
                        {showArchived ? 'Ocultar Archivo' : 'Archivados'}
                    </button>
                </div>
            </div>
        </div>
    );
};




export default ConversationList;
