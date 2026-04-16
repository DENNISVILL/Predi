"""
Alembic Migration - Initial Schema
Creates all tables for Predix database
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Create all tables"""
    
    # ============================================
    # Users Table
    # ============================================
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        
        # Subscription
        sa.Column('plan', sa.Enum('FREE', 'PRO', 'ENTERPRISE', name='plantype'), nullable=False),
        sa.Column('stripe_customer_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_subscription_id', sa.String(length=255), nullable=True),
        
        # Status
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'),
        
        # Verification
        sa.Column('verification_token', sa.String(length=255), nullable=True),
        sa.Column('verification_token_expires', sa.DateTime(timezone=True), nullable=True),
        
        # Password Reset
        sa.Column('reset_password_token', sa.String(length=255), nullable=True),
        sa.Column('reset_password_expires', sa.DateTime(timezone=True), nullable=True),
        
        # Usage
        sa.Column('posts_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('predictions_count', sa.Integer(), nullable=False, server_default='0'),
        
        # Preferences
        sa.Column('timezone', sa.String(length=50), nullable=False, server_default='UTC'),
        sa.Column('language', sa.String(length=10), nullable=False, server_default='en'),
        sa.Column('email_notifications', sa.Boolean(), nullable=False, server_default='true'),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('stripe_customer_id'),
        sa.UniqueConstraint('stripe_subscription_id'),
        sa.UniqueConstraint('verification_token'),
        sa.UniqueConstraint('reset_password_token'),
    )
    
    # Indexes
    op.create_index('ix_users_email', 'users', ['email'])
    op.create_index('ix_users_plan', 'users', ['plan'])
    op.create_index('ix_users_stripe_customer_id', 'users', ['stripe_customer_id'])
    
    # ============================================
    # Posts Table
    # ============================================
    op.create_table(
        'posts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        
        # Content
        sa.Column('title', sa.String(length=500), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        
        # Platform & Status
        sa.Column('platform', sa.Enum('TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'FACEBOOK', 'LINKEDIN', 'TWITTER', name='platform'), nullable=False),
        sa.Column('status', sa.Enum('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED', 'CANCELLED', name='poststatus'), nullable=False),
        sa.Column('content_type', sa.Enum('IMAGE', 'VIDEO', 'TEXT', 'CAROUSEL', 'STORY', 'REEL', name='contenttype'), nullable=False),
        
        # Media
        sa.Column('media_url', sa.String(length=1000), nullable=True),
        sa.Column('media_thumbnail_url', sa.String(length=1000), nullable=True),
        sa.Column('media_type', sa.String(length=50), nullable=True),
        sa.Column('media_size', sa.Integer(), nullable=True),
        sa.Column('media_duration', sa.Integer(), nullable=True),
        
        # Scheduling
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
        
        # AI Predictions
        sa.Column('viral_score', sa.Integer(), nullable=True),
        sa.Column('predicted_reach', sa.Integer(), nullable=True),
        sa.Column('predicted_engagement', sa.Float(), nullable=True),
        sa.Column('prediction_confidence', sa.Float(), nullable=True),
        sa.Column('ai_recommendations', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        
        # Hashtags & Tags
        sa.Column('hashtags', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('mentions', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        
        # Location
        sa.Column('location_name', sa.String(length=255), nullable=True),
        sa.Column('location_lat', sa.Float(), nullable=True),
        sa.Column('location_lng', sa.Float(), nullable=True),
        
        # Metadata
        sa.Column('metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        
        # Actual Performance
        sa.Column('actual_reach', sa.Integer(), nullable=True),
        sa.Column('actual_impressions', sa.Integer(), nullable=True),
        sa.Column('actual_likes', sa.Integer(), nullable=True),
        sa.Column('actual_comments', sa.Integer(), nullable=True),
        sa.Column('actual_shares', sa.Integer(), nullable=True),
        sa.Column('actual_saves', sa.Integer(), nullable=True),
        sa.Column('actual_engagement', sa.Float(), nullable=True),
        
        # Error Handling
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('retry_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('last_retry_at', sa.DateTime(timezone=True), nullable=True),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    
    # Indexes
    op.create_index('ix_posts_user_id', 'posts', ['user_id'])
    op.create_index('ix_posts_platform', 'posts', ['platform'])
    op.create_index('ix_posts_status', 'posts', ['status'])
    op.create_index('ix_posts_scheduled_at', 'posts', ['scheduled_at'])
    op.create_index('ix_posts_created_at', 'posts', ['created_at'])
    
    # ============================================
    # Subscriptions Table
    # ============================================
    op.create_table(
        'subscriptions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        
        # Stripe
        sa.Column('stripe_subscription_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_customer_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_price_id', sa.String(length=255), nullable=True),
        sa.Column('stripe_invoice_id', sa.String(length=255), nullable=True),
        
        # Plan & Status
        sa.Column('plan', sa.Enum('FREE', 'PRO_MONTHLY', 'PRO_YEARLY', 'ENTERPRISE', name='subscriptionplan'), nullable=False),
        sa.Column('status', sa.Enum('ACTIVE', 'PAST_DUE', 'CANCELLED', 'UNPAID', 'TRIALING', 'PAUSED', name='subscriptionstatus'), nullable=False),
        
        # Billing
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False, server_default='USD'),
        sa.Column('billing_interval', sa.String(length=10), nullable=False),
        
        # Periods
        sa.Column('current_period_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('current_period_end', sa.DateTime(timezone=True), nullable=True),
        sa.Column('trial_start', sa.DateTime(timezone=True), nullable=True),
        sa.Column('trial_end', sa.DateTime(timezone=True), nullable=True),
        
        # Cancellation
        sa.Column('cancel_at_period_end', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancellation_reason', sa.String(length=500), nullable=True),
        
        # Payment Method
        sa.Column('payment_method_type', sa.String(length=50), nullable=True),
        sa.Column('card_last_4', sa.String(length=4), nullable=True),
        sa.Column('card_brand', sa.String(length=20), nullable=True),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('stripe_subscription_id'),
    )
    
    # Indexes
    op.create_index('ix_subscriptions_user_id', 'subscriptions', ['user_id'])
    op.create_index('ix_subscriptions_plan', 'subscriptions', ['plan'])
    op.create_index('ix_subscriptions_status', 'subscriptions', ['status'])
    op.create_index('ix_subscriptions_stripe_customer_id', 'subscriptions', ['stripe_customer_id'])
    op.create_index('ix_subscriptions_current_period_end', 'subscriptions', ['current_period_end'])
    
    # ============================================
    # Predictions Table
    # ============================================
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('post_id', sa.Integer(), nullable=True),
        
        # Model Info
        sa.Column('model_version', sa.String(length=50), nullable=False, server_default='1.0'),
        sa.Column('model_name', sa.String(length=100), nullable=False, server_default='gpt-4-viral-predictor'),
        
        # Results
        sa.Column('viral_score', sa.Integer(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        
        # Predicted Metrics
        sa.Column('predicted_reach', sa.Integer(), nullable=True),
        sa.Column('predicted_engagement', sa.Float(), nullable=True),
        sa.Column('predicted_views', sa.Integer(), nullable=True),
        sa.Column('predicted_likes', sa.Integer(), nullable=True),
        sa.Column('predicted_shares', sa.Integer(), nullable=True),
        sa.Column('predicted_comments', sa.Integer(), nullable=True),
        sa.Column('predicted_saves', sa.Integer(), nullable=True),
        
        # Analysis
        sa.Column('factors_analysis', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('recommendations', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('input_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        
        # Metadata
        sa.Column('platform', sa.String(length=50), nullable=True),
        sa.Column('content_type', sa.String(length=50), nullable=True),
        sa.Column('content_length', sa.Integer(), nullable=True),
        sa.Column('has_media', sa.Boolean(), server_default='false'),
        sa.Column('hashtag_count', sa.Integer(), nullable=True),
        
        # Performance
        sa.Column('processing_time_ms', sa.Integer(), nullable=True),
        sa.Column('api_cost', sa.Float(), nullable=True),
        
        # Validation
        sa.Column('is_validated', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('actual_viral_score', sa.Integer(), nullable=True),
        sa.Column('prediction_accuracy', sa.Float(), nullable=True),
        
        # Error Handling
        sa.Column('error_occurred', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('error_message', sa.Text(), nullable=True),
        
        # Timestamps
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('validated_at', sa.DateTime(timezone=True), nullable=True),
        
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
    )
    
    # Indexes
    op.create_index('ix_predictions_user_id', 'predictions', ['user_id'])
    op.create_index('ix_predictions_post_id', 'predictions', ['post_id'])
    op.create_index('ix_predictions_created_at', 'predictions', ['created_at'])


def downgrade():
    """Drop all tables"""
    op.drop_table('predictions')
    op.drop_table('subscriptions')
    op.drop_table('posts')
    op.drop_table('users')
    
    # Drop enums
    op.execute('DROP TYPE IF EXISTS plantype')
    op.execute('DROP TYPE IF EXISTS platform')
    op.execute('DROP TYPE IF EXISTS poststatus')
    op.execute('DROP TYPE IF EXISTS contenttype')
    op.execute('DROP TYPE IF EXISTS subscriptionplan')
    op.execute('DROP TYPE IF EXISTS subscriptionstatus')
