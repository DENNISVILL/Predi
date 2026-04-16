/**
 * Posts API Service
 * All API calls related to posts management
 */
import apiClient from './apiClient';

export interface Post {
    id: number;
    user_id: number;
    title: string;
    content: string;
    platform: string;
    status: string;
    content_type?: string;
    hashtags?: string[];
    scheduled_at?: string;
    published_at?: string;
    ai_recommendations?: string[];
    viral_score?: number;
    viral_score_prediction?: number;
    created_at: string;
    updated_at: string;
}

export interface PostCreate {
    title: string;
    content: string;
    platform: string;
    content_type?: string;
    hashtags?: string[];
    scheduled_at?: string;
}

export interface PostUpdate {
    title?: string;
    content?: string;
    platform?: string;
    status?: string;
    content_type?: string;
    hashtags?: string[];
    scheduled_at?: string;
}

export interface PostFilters {
    page?: number;
    page_size?: number;
    limit?: number;
    status?: string;
    status_filter?: string;
    platform?: string;
    platform_filter?: string;
    search?: string;
    sort_by?: string;
}

export interface PostList {
    posts: Post[];
    total: number;
    page: number;
    pages: number;
}

class PostsService {
    /**
     * Create a new post
     */
    async createPost(data: PostCreate): Promise<Post> {
        const response = await apiClient.post('/posts', data);
        return response.data as Post;
    }

    /**
     * Get list of posts with filters
     */
    async getPosts(filters?: PostFilters): Promise<PostList> {
        const response = await apiClient.get('/posts', { params: filters });
        return response.data as PostList;
    }

    /**
     * Get a single post by ID
     */
    async getPost(postId: number): Promise<Post> {
        const response = await apiClient.get(`/posts/${postId}`);
        return response.data as Post;
    }

    /**
     * Update a post
     */
    async updatePost(postId: number, data: PostUpdate): Promise<Post> {
        const response = await apiClient.put(`/posts/${postId}`, data);
        return response.data as Post;
    }

    /**
     * Delete a post
     */
    async deletePost(postId: number): Promise<void> {
        await apiClient.delete(`/posts/${postId}`);
    }

    /**
     * Schedule a post for publishing
     */
    async schedulePost(postId: number, scheduledAt: string): Promise<Post> {
        const response = await apiClient.post(`/posts/${postId}/schedule`, {
            scheduled_at: scheduledAt
        });
        return response.data as Post;
    }

    /**
     * Publish a post immediately
     */
    async publishPost(postId: number): Promise<Post> {
        const response = await apiClient.post(`/posts/${postId}/publish`);
        return response.data as Post;
    }

    /**
     * Cancel a scheduled post
     */
    async cancelScheduledPost(postId: number): Promise<Post> {
        const response = await apiClient.post(`/posts/${postId}/cancel`);
        return response.data as Post;
    }

    /**
     * Get draft posts
     */
    async getDrafts(): Promise<Post[]> {
        const response = await apiClient.get('/posts/drafts/list');
        return response.data as Post[];
    }

    /**
     * Get scheduled posts
     */
    async getScheduledPosts(): Promise<Post[]> {
        const response = await apiClient.get('/posts/scheduled/list');
        return response.data as Post[];
    }
}

export const postsService = new PostsService();
export default postsService;
