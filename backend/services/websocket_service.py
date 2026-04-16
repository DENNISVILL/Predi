"""
WebSocket Service for Predix Backend
Real-time notifications and live updates
"""

import asyncio
import json
import logging
from typing import Dict, List, Optional, Set
from datetime import datetime, timezone
import jwt
from fastapi import WebSocket, WebSocketDisconnect, status
from fastapi.applications import FastAPI
from sqlalchemy.orm import Session

from config.settings import settings
from database.connection import get_db, CacheManager
from database.models import User, Alert
from services.auth_service import auth_service

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        # Active connections: {user_id: {connection_id: websocket}}
        self.active_connections: Dict[int, Dict[str, WebSocket]] = {}
        
        # Connection metadata: {connection_id: {user_id, connected_at, last_ping}}
        self.connection_metadata: Dict[str, Dict] = {}
        
        # Room subscriptions: {room_name: {user_ids}}
        self.rooms: Dict[str, Set[int]] = {}
        
        # Statistics
        self.stats = {
            "total_connections": 0,
            "active_connections": 0,
            "messages_sent": 0,
            "messages_received": 0
        }
    
    async def connect(self, websocket: WebSocket, user: User, connection_id: str):
        """Accept new WebSocket connection"""
        await websocket.accept()
        
        # Initialize user connections if not exists
        if user.id not in self.active_connections:
            self.active_connections[user.id] = {}
        
        # Store connection
        self.active_connections[user.id][connection_id] = websocket
        
        # Store metadata
        self.connection_metadata[connection_id] = {
            "user_id": user.id,
            "connected_at": datetime.now(timezone.utc),
            "last_ping": datetime.now(timezone.utc),
            "user_agent": None,  # Could be extracted from headers
            "ip_address": None   # Could be extracted from client
        }
        
        # Update statistics
        self.stats["total_connections"] += 1
        self.stats["active_connections"] = len(self.connection_metadata)
        
        # Join user to their personal room
        await self.join_room(f"user_{user.id}", user.id)
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection_established",
            "message": "Connected to Predix real-time updates",
            "user_id": user.id,
            "connection_id": connection_id,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }, websocket)
        
        logger.info(f"WebSocket connected: User {user.id}, Connection {connection_id}")
    
    async def disconnect(self, connection_id: str):
        """Handle WebSocket disconnection"""
        if connection_id not in self.connection_metadata:
            return
        
        metadata = self.connection_metadata[connection_id]
        user_id = metadata["user_id"]
        
        # Remove from active connections
        if user_id in self.active_connections:
            self.active_connections[user_id].pop(connection_id, None)
            
            # Remove user entry if no more connections
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        
        # Remove from all rooms
        for room_name, user_ids in self.rooms.items():
            user_ids.discard(user_id)
        
        # Clean up empty rooms
        self.rooms = {k: v for k, v in self.rooms.items() if v}
        
        # Remove metadata
        del self.connection_metadata[connection_id]
        
        # Update statistics
        self.stats["active_connections"] = len(self.connection_metadata)
        
        logger.info(f"WebSocket disconnected: User {user_id}, Connection {connection_id}")
    
    async def send_personal_message(self, message: Dict, websocket: WebSocket):
        """Send message to specific WebSocket connection"""
        try:
            await websocket.send_text(json.dumps(message))
            self.stats["messages_sent"] += 1
        except Exception as e:
            logger.error(f"Failed to send personal message: {e}")
    
    async def send_to_user(self, user_id: int, message: Dict):
        """Send message to all connections of a specific user"""
        if user_id not in self.active_connections:
            return
        
        # Send to all user's connections
        disconnected_connections = []
        
        for connection_id, websocket in self.active_connections[user_id].items():
            try:
                await websocket.send_text(json.dumps(message))
                self.stats["messages_sent"] += 1
            except Exception as e:
                logger.error(f"Failed to send message to user {user_id}: {e}")
                disconnected_connections.append(connection_id)
        
        # Clean up disconnected connections
        for connection_id in disconnected_connections:
            await self.disconnect(connection_id)
    
    async def broadcast_to_room(self, room_name: str, message: Dict, exclude_user: Optional[int] = None):
        """Broadcast message to all users in a room"""
        if room_name not in self.rooms:
            return
        
        user_ids = self.rooms[room_name].copy()
        if exclude_user:
            user_ids.discard(exclude_user)
        
        for user_id in user_ids:
            await self.send_to_user(user_id, message)
    
    async def broadcast_to_all(self, message: Dict):
        """Broadcast message to all connected users"""
        for user_id in self.active_connections.keys():
            await self.send_to_user(user_id, message)
    
    async def join_room(self, room_name: str, user_id: int):
        """Add user to a room"""
        if room_name not in self.rooms:
            self.rooms[room_name] = set()
        
        self.rooms[room_name].add(user_id)
        logger.debug(f"User {user_id} joined room {room_name}")
    
    async def leave_room(self, room_name: str, user_id: int):
        """Remove user from a room"""
        if room_name in self.rooms:
            self.rooms[room_name].discard(user_id)
            
            # Remove empty room
            if not self.rooms[room_name]:
                del self.rooms[room_name]
        
        logger.debug(f"User {user_id} left room {room_name}")
    
    async def get_room_users(self, room_name: str) -> Set[int]:
        """Get list of users in a room"""
        return self.rooms.get(room_name, set())
    
    async def get_user_rooms(self, user_id: int) -> List[str]:
        """Get list of rooms a user is in"""
        return [room_name for room_name, user_ids in self.rooms.items() if user_id in user_ids]
    
    async def ping_connections(self):
        """Send ping to all connections to keep them alive"""
        ping_message = {
            "type": "ping",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        disconnected_connections = []
        
        for connection_id, metadata in self.connection_metadata.items():
            user_id = metadata["user_id"]
            
            if user_id in self.active_connections:
                for conn_id, websocket in self.active_connections[user_id].items():
                    if conn_id == connection_id:
                        try:
                            await websocket.send_text(json.dumps(ping_message))
                            metadata["last_ping"] = datetime.now(timezone.utc)
                        except Exception as e:
                            logger.error(f"Ping failed for connection {connection_id}: {e}")
                            disconnected_connections.append(connection_id)
        
        # Clean up failed connections
        for connection_id in disconnected_connections:
            await self.disconnect(connection_id)
    
    def get_stats(self) -> Dict:
        """Get connection statistics"""
        return {
            **self.stats,
            "rooms": len(self.rooms),
            "users_online": len(self.active_connections),
            "connections_per_user": {
                user_id: len(connections) 
                for user_id, connections in self.active_connections.items()
            }
        }

class WebSocketManager:
    """Main WebSocket manager with FastAPI integration"""
    
    def __init__(self):
        self.connection_manager = ConnectionManager()
        self.app = FastAPI()
        self._setup_routes()
        
        # Background tasks
        self._heartbeat_task = None
        self._cleanup_task = None
    
    def _setup_routes(self):
        """Setup WebSocket routes"""
        
        @self.app.websocket("/connect")
        async def websocket_endpoint(websocket: WebSocket, token: str):
            """Main WebSocket connection endpoint"""
            connection_id = f"conn_{datetime.now().timestamp()}"
            
            try:
                # Authenticate user from token
                user = await self._authenticate_websocket(token)
                
                # Connect user
                await self.connection_manager.connect(websocket, user, connection_id)
                
                # Handle messages
                await self._handle_websocket_messages(websocket, user, connection_id)
                
            except Exception as e:
                logger.error(f"WebSocket connection error: {e}")
                await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            finally:
                await self.connection_manager.disconnect(connection_id)
        
        @self.app.get("/stats")
        async def get_websocket_stats():
            """Get WebSocket statistics"""
            return self.connection_manager.get_stats()
    
    async def _authenticate_websocket(self, token: str) -> User:
        """Authenticate WebSocket connection using JWT token"""
        try:
            # Verify JWT token
            payload = auth_service.verify_token(token)
            
            # Get user from database
            from database.connection import SessionLocal
            db = SessionLocal()
            
            try:
                user_id = payload.get("sub")
                user = db.query(User).filter(User.id == user_id).first()
                
                if not user or not user.is_active:
                    raise Exception("Invalid or inactive user")
                
                return user
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"WebSocket authentication failed: {e}")
            raise
    
    async def _handle_websocket_messages(self, websocket: WebSocket, user: User, connection_id: str):
        """Handle incoming WebSocket messages"""
        try:
            while True:
                # Receive message
                data = await websocket.receive_text()
                message = json.loads(data)
                
                self.connection_manager.stats["messages_received"] += 1
                
                # Handle different message types
                message_type = message.get("type")
                
                if message_type == "pong":
                    # Update last ping time
                    if connection_id in self.connection_manager.connection_metadata:
                        self.connection_manager.connection_metadata[connection_id]["last_ping"] = datetime.now(timezone.utc)
                
                elif message_type == "join_room":
                    room_name = message.get("room")
                    if room_name:
                        await self.connection_manager.join_room(room_name, user.id)
                        await self.connection_manager.send_personal_message({
                            "type": "room_joined",
                            "room": room_name,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        }, websocket)
                
                elif message_type == "leave_room":
                    room_name = message.get("room")
                    if room_name:
                        await self.connection_manager.leave_room(room_name, user.id)
                        await self.connection_manager.send_personal_message({
                            "type": "room_left",
                            "room": room_name,
                            "timestamp": datetime.now(timezone.utc).isoformat()
                        }, websocket)
                
                elif message_type == "subscribe_alerts":
                    # Subscribe to real-time alerts
                    await self.connection_manager.join_room("alerts", user.id)
                    await self.connection_manager.send_personal_message({
                        "type": "subscribed",
                        "subscription": "alerts",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }, websocket)
                
                elif message_type == "unsubscribe_alerts":
                    # Unsubscribe from alerts
                    await self.connection_manager.leave_room("alerts", user.id)
                    await self.connection_manager.send_personal_message({
                        "type": "unsubscribed",
                        "subscription": "alerts",
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    }, websocket)
                
                else:
                    logger.warning(f"Unknown message type: {message_type}")
                
        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected normally: {connection_id}")
        except Exception as e:
            logger.error(f"WebSocket message handling error: {e}")
    
    async def send_alert_notification(self, alert: Alert, user: User):
        """Send alert notification to user via WebSocket"""
        message = {
            "type": "alert_notification",
            "alert": {
                "id": alert.uuid,
                "type": alert.type,
                "title": alert.title,
                "message": alert.message,
                "priority": alert.priority,
                "trend_data": alert.trend_data,
                "created_at": alert.created_at.isoformat()
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await self.connection_manager.send_to_user(user.id, message)
    
    async def broadcast_trending_update(self, platform: str, trends: List[Dict]):
        """Broadcast trending updates to subscribed users"""
        message = {
            "type": "trending_update",
            "platform": platform,
            "trends": trends,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await self.connection_manager.broadcast_to_room("trending_updates", message)
    
    async def send_prediction_result(self, user: User, prediction: Dict):
        """Send prediction result to user"""
        message = {
            "type": "prediction_result",
            "prediction": prediction,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await self.connection_manager.send_to_user(user.id, message)
    
    async def broadcast_system_announcement(self, announcement: str, priority: str = "info"):
        """Broadcast system announcement to all users"""
        message = {
            "type": "system_announcement",
            "message": announcement,
            "priority": priority,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await self.connection_manager.broadcast_to_all(message)
    
    async def start_background_tasks(self):
        """Start background tasks for WebSocket management"""
        # Heartbeat task
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())
        
        # Cleanup task
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
        logger.info("WebSocket background tasks started")
    
    async def stop_background_tasks(self):
        """Stop background tasks"""
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
        
        if self._cleanup_task:
            self._cleanup_task.cancel()
        
        logger.info("WebSocket background tasks stopped")
    
    async def _heartbeat_loop(self):
        """Background task to send heartbeat pings"""
        while True:
            try:
                await asyncio.sleep(settings.WS_HEARTBEAT_INTERVAL)
                await self.connection_manager.ping_connections()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat loop error: {e}")
    
    async def _cleanup_loop(self):
        """Background task to clean up stale connections"""
        while True:
            try:
                await asyncio.sleep(300)  # Run every 5 minutes
                
                # Find stale connections (no ping in last 2 minutes)
                stale_threshold = datetime.now(timezone.utc).timestamp() - 120
                stale_connections = []
                
                for connection_id, metadata in self.connection_manager.connection_metadata.items():
                    if metadata["last_ping"].timestamp() < stale_threshold:
                        stale_connections.append(connection_id)
                
                # Disconnect stale connections
                for connection_id in stale_connections:
                    await self.connection_manager.disconnect(connection_id)
                    logger.info(f"Cleaned up stale connection: {connection_id}")
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Cleanup loop error: {e}")
    
    def get_app(self) -> FastAPI:
        """Get FastAPI app for mounting"""
        return self.app

# Global WebSocket manager instance
websocket_manager = WebSocketManager()

# Utility functions for easy access
async def send_user_alert(user_id: int, alert_data: Dict):
    """Send alert to specific user"""
    await websocket_manager.connection_manager.send_to_user(user_id, {
        "type": "alert",
        **alert_data,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

async def broadcast_trending_update(platform: str, trends: List[Dict]):
    """Broadcast trending update"""
    await websocket_manager.broadcast_trending_update(platform, trends)

async def send_system_notification(message: str, priority: str = "info"):
    """Send system notification to all users"""
    await websocket_manager.broadcast_system_announcement(message, priority)

# Export main components
__all__ = [
    "WebSocketManager",
    "ConnectionManager",
    "websocket_manager",
    "send_user_alert",
    "broadcast_trending_update",
    "send_system_notification"
]
