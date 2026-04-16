/**
 * PostsManager Component
 * Complete CRUD interface for managing social media posts
 * Features: Create, Read, Update, Delete, Schedule, Publish posts
 */
import React, { useState, useEffect } from 'react';
import { postsService, Post, PostCreate, PostFilters } from '../services/postsService';

interface PostsManagerProps {
    className?: string;
}

const PostsManager: React.FC<PostsManagerProps> = ({ className = '' }) => {
    // State management
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isCreating, setIsCreating] = useState(false);
    const [filters, setFilters] = useState<PostFilters>({
        page: 1,
        page_size: 10,
        status_filter: 'all',
        platform_filter: 'all'
    });

    // Form state for creating/editing
    const [formData, setFormData] = useState<PostCreate>({
        title: '',
        content: '',
        platform: 'tiktok',
        content_type: 'video',
        hashtags: [],
    });

    // Platforms and content types
    const platforms = ['tiktok', 'instagram', 'youtube', 'facebook', 'twitter', 'linkedin'];
    const contentTypes = ['video', 'image', 'text', 'carousel', 'reel', 'story'];
    const statuses = ['all', 'draft', 'scheduled', 'published', 'failed'];

    // Load posts on mount and filter changes
    useEffect(() => {
        loadPosts();
    }, [filters]);

    const loadPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await postsService.getPosts(filters);
            setPosts(response.posts);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const newPost = await postsService.createPost(formData);
            setPosts([newPost, ...posts]);
            setIsCreating(false);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };



    const handleDeletePost = async (postId: number) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        setLoading(true);
        try {
            await postsService.deletePost(postId);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to delete post');
        } finally {
            setLoading(false);
        }
    };

    const handlePublishPost = async (postId: number) => {
        setLoading(true);
        try {
            const published = await postsService.publishPost(postId);
            setPosts(posts.map(p => p.id === postId ? published : p));
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to publish post');
        } finally {
            setLoading(false);
        }
    };

    const handleSchedulePost = async (postId: number, scheduledAt: string) => {
        setLoading(true);
        try {
            const scheduled = await postsService.schedulePost(postId, scheduledAt);
            setPosts(posts.map(p => p.id === postId ? scheduled : p));
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to schedule post');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            platform: 'tiktok',
            content_type: 'video',
            hashtags: [],
        });
    };

    const getStatusBadgeColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800',
            scheduled: 'bg-blue-100 text-blue-800',
            publishing: 'bg-yellow-100 text-yellow-800',
            published: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-600',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPlatformIcon = (platform: string) => {
        const icons: Record<string, string> = {
            tiktok: '🎵',
            instagram: '📷',
            youtube: '▶️',
            facebook: '👍',
            twitter: '🐦',
            linkedin: '💼',
        };
        return icons[platform.toLowerCase()] || '📱';
    };

    return (
        <div className={`posts-manager ${className}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-6 text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">📝 Posts Manager</h1>
                        <p className="text-purple-100">Schedule and manage your social media content</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(!isCreating)}
                        className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        {isCreating ? '✖ Cancel' : '+ New Post'}
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-center">
                        <span className="text-red-500 mr-3 text-xl">⚠️</span>
                        <p className="text-red-700">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                            ✖
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Form */}
            {isCreating && (
                <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border-2 border-purple-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Post</h2>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Post Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                    placeholder="Enter post title..."
                                    required
                                />
                            </div>

                            {/* Platform */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Platform *
                                </label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                    required
                                >
                                    {platforms.map(p => (
                                        <option key={p} value={p}>
                                            {getPlatformIcon(p)} {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Content Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Content Type *
                                </label>
                                <select
                                    value={formData.content_type}
                                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                    required
                                >
                                    {contentTypes.map(ct => (
                                        <option key={ct} value={ct}>
                                            {ct.charAt(0).toUpperCase() + ct.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Content / Caption
                                </label>
                                <textarea
                                    value={formData.content || ''}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                    rows={4}
                                    placeholder="Write your content here..."
                                />
                            </div>

                            {/* Hashtags */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Hashtags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="#viral, #trending, #fyp"
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        hashtags: e.target.value.split(',').map(h => h.trim()).filter(Boolean)
                                    })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>

                            {/* Scheduled Date */}
                            <div className="md:col-span-2 ">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Schedule for Later (optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                            >
                                {loading ? 'Creating...' : '✓ Create Post'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsCreating(false); resetForm(); }}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.status_filter}
                            onChange={(e) => setFilters({ ...filters, status_filter: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                        >
                            {statuses.map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
                        <select
                            value={filters.platform_filter}
                            onChange={(e) => setFilters({ ...filters, platform_filter: e.target.value, page: 1 })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                        >
                            <option value="all">All Platforms</option>
                            {platforms.map(p => (
                                <option key={p} value={p}>{getPlatformIcon(p)} {p.charAt(0).toUpperCase() + p.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Per Page</label>
                        <select
                            value={filters.page_size}
                            onChange={(e) => setFilters({ ...filters, page_size: parseInt(e.target.value), page: 1 })}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 transition-all"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Posts List */}
            {loading && posts.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-6">Create your first post to get started</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                    >
                        + Create Post
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map(post => (
                        <div key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-purple-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">{getPlatformIcon(post.platform)}</span>
                                            <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                                        </div>
                                        <div className="flex gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(post.status)}`}>
                                                {post.status.toUpperCase()}
                                            </span>
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                                {post.content_type}
                                            </span>
                                            {post.viral_score && (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                                                    🔥 {post.viral_score}/100
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {post.status === 'draft' && (
                                            <>
                                                <button
                                                    onClick={() => handlePublishPost(post.id)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-all"
                                                    disabled={loading}
                                                >
                                                    ▶ Publish
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const date = prompt('Schedule for (YYYY-MM-DD HH:MM):');
                                                        if (date) handleSchedulePost(post.id, date);
                                                    }}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all"
                                                    disabled={loading}
                                                >
                                                    📅 Schedule
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-all"
                                            disabled={loading || post.status === 'published'}
                                        >
                                            🗑 Delete
                                        </button>
                                    </div>
                                </div>

                                {post.content && (
                                    <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                                )}

                                {post.hashtags && post.hashtags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {post.hashtags.map((tag, idx) => (
                                            <span key={idx} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                                    <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                                    {post.scheduled_at && (
                                        <span className="text-blue-600 font-semibold">
                                            📅 Scheduled: {new Date(post.scheduled_at).toLocaleString()}
                                        </span>
                                    )}
                                    {post.published_at && (
                                        <span className="text-green-600 font-semibold">
                                            ✓ Published: {new Date(post.published_at).toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {post.ai_recommendations && post.ai_recommendations.length > 0 && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-semibold text-purple-700 mb-2">🤖 AI Recommendations:</p>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            {post.ai_recommendations.slice(0, 3).map((rec, idx) => (
                                                <li key={idx} className="flex items-start">
                                                    <span className="text-purple-500 mr-2">•</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {posts.length > 0 && (
                <div className="mt-6 flex justify-center gap-2">
                    <button
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                        ← Previous
                    </button>
                    <span className="px-4 py-2 flex items-center text-gray-700 font-semibold">
                        Page {filters.page || 1}
                    </span>
                    <button
                        onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                        disabled={posts.length < (filters.page_size || 10)}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostsManager;
