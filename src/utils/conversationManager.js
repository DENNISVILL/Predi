/**
 * ConversationManager - Manages conversation state and storage
 */

class ConversationManager {
    constructor() {
        this.storageKey = 'predix_ai_conversations';
    }

    // Get all conversations from localStorage
    getAllConversations() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading conversations:', error);
            return [];
        }
    }

    // Save conversations to localStorage
    saveConversations(conversations) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(conversations));
            return true;
        } catch (error) {
            console.error('Error saving conversations:', error);
            return false;
        }
    }

    // Create new conversation
    createConversation(title = 'Nueva conversación') {
        const newConv = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: false,
            isArchived: false,
            model: 'predix-pro',
            metadata: {
                totalMessages: 0,
                totalTokens: 0,
                lastModel: 'predix-pro'
            }
        };

        const conversations = this.getAllConversations();
        conversations.unshift(newConv);
        this.saveConversations(conversations);

        return newConv;
    }

    // Get conversation by ID
    getConversation(id) {
        const conversations = this.getAllConversations();
        return conversations.find(conv => conv.id === id);
    }

    // Update conversation
    updateConversation(id, updates) {
        const conversations = this.getAllConversations();
        const index = conversations.findIndex(conv => conv.id === id);

        if (index !== -1) {
            conversations[index] = {
                ...conversations[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveConversations(conversations);
            return conversations[index];
        }

        return null;
    }

    // Add message to conversation
    addMessage(conversationId, message) {
        const conversation = this.getConversation(conversationId);

        if (conversation) {
            conversation.messages.push({
                ...message,
                id: message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                timestamp: message.timestamp || new Date().toISOString()
            });

            conversation.metadata.totalMessages = conversation.messages.length;
            conversation.updatedAt = new Date().toISOString();

            // Auto-generate title from first user message
            if (conversation.messages.length === 2 && conversation.title === 'Nueva conversación') {
                const firstUserMessage = conversation.messages.find(m => m.type === 'user');
                if (firstUserMessage) {
                    conversation.title = this.generateTitle(firstUserMessage.content);
                }
            }

            this.updateConversation(conversationId, conversation);
            return conversation;
        }

        return null;
    }

    // Generate title from message
    generateTitle(content) {
        const maxLength = 50;
        const cleaned = content.trim().replace(/\n/g, ' ').substring(0, maxLength);
        return cleaned.length === maxLength ? cleaned + '...' : cleaned;
    }

    // Rename conversation
    renameConversation(id, newTitle) {
        return this.updateConversation(id, { title: newTitle });
    }

    // Delete conversation
    deleteConversation(id) {
        const conversations = this.getAllConversations();
        const filtered = conversations.filter(conv => conv.id !== id);
        this.saveConversations(filtered);
        return true;
    }

    // Archive conversation
    archiveConversation(id) {
        const conversation = this.getConversation(id);
        if (conversation) {
            return this.updateConversation(id, { isArchived: !conversation.isArchived });
        }
        return null;
    }

    // Pin conversation
    pinConversation(id) {
        const conversation = this.getConversation(id);
        if (conversation) {
            return this.updateConversation(id, { isPinned: !conversation.isPinned });
        }
        return null;
    }

    // Search conversations
    searchConversations(query) {
        const conversations = this.getAllConversations();
        const lowerQuery = query.toLowerCase();

        return conversations.filter(conv =>
            conv.title.toLowerCase().includes(lowerQuery) ||
            conv.messages.some(msg =>
                msg.content.toLowerCase().includes(lowerQuery)
            )
        );
    }

    // Group conversations by date
    groupByDate(conversations) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const groups = {
            pinned: [],
            today: [],
            yesterday: [],
            last7Days: [],
            last30Days: [],
            older: []
        };

        conversations.forEach(conv => {
            const convDate = new Date(conv.updatedAt);

            if (conv.isPinned) {
                groups.pinned.push(conv);
            } else if (convDate >= today) {
                groups.today.push(conv);
            } else if (convDate >= yesterday && convDate < today) {
                groups.yesterday.push(conv);
            } else if (convDate >= weekAgo && convDate < yesterday) {
                groups.last7Days.push(conv);
            } else if (convDate >= monthAgo && convDate < weekAgo) {
                groups.last30Days.push(conv);
            } else {
                groups.older.push(conv);
            }
        });

        return groups;
    }

    // Clear all conversations
    clearAll() {
        localStorage.removeItem(this.storageKey);
        return true;
    }

    // Export conversation as markdown
    exportAsMarkdown(conversationId) {
        const conversation = this.getConversation(conversationId);
        if (!conversation) return null;

        let markdown = `# ${conversation.title}\n\n`;
        markdown += `*Created: ${new Date(conversation.createdAt).toLocaleString()}*\n\n`;
        markdown += `---\n\n`;

        conversation.messages.forEach(msg => {
            const role = msg.type === 'user' ? '**You**' : '**Predix AI**';
            const timestamp = new Date(msg.timestamp).toLocaleTimeString();
            markdown += `### ${role} (${timestamp})\n\n`;
            markdown += `${msg.content}\n\n`;
            markdown += `---\n\n`;
        });

        return markdown;
    }
}

export default new ConversationManager();
