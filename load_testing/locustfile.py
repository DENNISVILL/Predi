"""
Locust Load Testing Script for Predix Platform
Performance and load testing with realistic user behavior
"""

from locust import HttpUser, task, between, SequentialTaskSet
from locust.exception import StopUser
import json
import random
import time


# ============================================
# User Behaviors
# ============================================

class UserBehavior(SequentialTaskSet):
    """Sequential user behavior mimicking real usage"""
    
    def on_start(self):
        """Login before starting tasks"""
        self.access_token = None
        self.login()
    
    def login(self):
        """Authenticate user"""
        response = self.client.post("/api/v1/users/login", json={
            "email": f"loadtest{random.randint(1, 1000)}@predix.com",
            "password": "LoadTest123!"
        })
        
        if response.status_code == 200:
            data = response.json()
            self.access_token = data.get("access_token")
            self.headers = {"Authorization": f"Bearer {self.access_token}"}
        else:
            raise StopUser()
    
    @task
    def view_dashboard(self):
        """View dashboard"""
        self.client.get("/api/v1/users/me", headers=self.headers)
        time.sleep(random.uniform(2, 5))
    
    @task
    def browse_trends(self):
        """Browse trending content"""
        platforms = ["tiktok", "twitter", "instagram", "youtube"]
        platform = random.choice(platforms)
        
        self.client.get(
            f"/api/v1/trends?platform={platform}&limit=20",
            headers=self.headers,
            name="/api/v1/trends?platform=[platform]"
        )
        time.sleep(random.uniform(3, 8))
    
    @task
    def view_trend_details(self):
        """View specific trend"""
        trend_id = random.randint(1, 100)
        self.client.get(
            f"/api/v1/trends/{trend_id}",
            headers=self.headers,
            name="/api/v1/trends/[id]"
        )
        time.sleep(random.uniform(5, 15))
    
    @task(weight=2)
    def create_prediction(self):
        """Create AI prediction"""
        prediction_data = {
            "platform": random.choice(["tiktok", "twitter", "instagram"]),
            "name": f"#LoadTest{random.randint(1, 10000)}",
            "views": random.randint(100000, 10000000),
            "likes": random.randint(5000, 500000),
            "comments": random.randint(500, 50000),
            "shares": random.randint(1000, 100000)
        }
        
        self.client.post(
            "/api/v1/ai/predict",
            json=prediction_data,
            headers=self.headers
        )
        time.sleep(random.uniform(10, 20))  # Simulating waiting for AI
    
    @task
    def view_predictions(self):
        """View prediction history"""
        self.client.get("/api/v1/predictions", headers=self.headers)
        time.sleep(random.uniform(2, 5))
    
    @task
    def view_analytics(self):
        """View analytics"""
        periods = ["day", "week", "month"]
        period = random.choice(periods)
        
        self.client.get(
            f"/api/v1/analytics?period={period}",
            headers=self.headers,
            name="/api/v1/analytics?period=[period]"
        )
        time.sleep(random.uniform(5, 10))
    
    @task
    def check_alerts(self):
        """Check alerts"""
        self.client.get("/api/v1/alerts", headers=self.headers)
        time.sleep(random.uniform(1, 3))
    
    def on_stop(self):
        """Logout after tasks"""
        if self.access_token:
            self.client.post("/api/v1/users/logout", headers=self.headers)


class QuickBrowser(HttpUser):
    """User that browses quickly"""
    tasks = [UserBehavior]
    wait_time = between(1, 3)
    weight = 3


class NormalUser(HttpUser):
    """Regular user with normal behavior"""
    tasks = [UserBehavior]
    wait_time = between(3, 8)
    weight = 7


class PowerUser(HttpUser):
    """Power user making many predictions"""
    tasks = [UserBehavior]
    wait_time = between(1, 2)
    weight = 1
    
    @task(5)
    def heavy_ai_usage(self):
        """Make multiple predictions"""
        for _ in range(3):
            prediction_data = {
                "platform": "tiktok",
                "name": f"#PowerUser{random.randint(1, 1000)}",
                "views": random.randint(1000000, 50000000),
                "likes": random.randint(50000, 2000000),
                "comments": random.randint(5000, 200000),
                "shares": random.randint(10000, 500000)
            }
            
            self.client.post(
                "/api/v1/ai/predict",
                json=prediction_data,
                headers=getattr(self, 'headers', {})
            )
            time.sleep(1)


# ============================================
# Custom Event Hooks
# ============================================

from locust import events

@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    """Log slow requests"""
    if response_time > 1000:  # Over 1 second
        print(f"⚠️ Slow request: {name} took {response_time}ms")

@events.quitting.add_listener
def on_quitting(environment, **kwargs):
    """Print summary on exit"""
    stats = environment.stats
    print("\n" + "="*50)
    print("LOAD TEST SUMMARY")
    print("="*50)
    print(f"Total requests: {stats.total.num_requests}")
    print(f"Failures: {stats.total.num_failures}")
    print(f"Average response time: {stats.total.avg_response_time:.2f}ms")
    print(f"Max response time: {stats.total.max_response_time:.2f}ms")
    print(f"Requests per second: {stats.total.total_rps:.2f}")
    print("="*50)


# ============================================
# Custom Load Shapes
# ============================================

from locust import LoadTestShape

class StepLoadShape(LoadTestShape):
    """
    A step load shape that increases load in steps
    """
    step_time = 300  # 5 minutes per step
    step_load = 100  # users per step
    max_users = 1000
    spawn_rate = 20
    
    def tick(self):
        run_time = self.get_run_time()
        
        if run_time > self.step_time * (self.max_users / self.step_load):
            return None
        
        current_step = int(run_time // self.step_time)
        return (min(current_step * self.step_load, self.max_users), self.spawn_rate)


class SpikeLoadShape(LoadTestShape):
    """
    A spike load shape that simulates traffic spikes
    """
    time_limit = 3600  # 1 hour
    spawn_rate = 50
    
    def tick(self):
        run_time = self.get_run_time()
        
        if run_time > self.time_limit:
            return None
        
        # Normal load
        if run_time % 600 < 480:  # 8 minutes normal
            return (500, self.spawn_rate)
        # Spike
        else:  # 2 minutes spike
            return (2000, self.spawn_rate * 2)


# ============================================
# Usage Examples
# ============================================

"""
# Run with web UI:
locust -f locustfile.py --host=http://localhost:8000

# Run headless:
locust -f locustfile.py --host=http://localhost:8000 \\
    --users 1000 \\
    --spawn-rate 100 \\
    --run-time 1h \\
    --headless

# Run with step load shape:
locust -f locustfile.py --host=http://localhost:8000 \\
    --headless \\
    --load-shape StepLoadShape

# Run with spike load shape:
locust -f locustfile.py --host=http://localhost:8000 \\
    --headless \\
    --load-shape SpikeLoadShape

# Generate report:
locust -f locustfile.py --host=http://localhost:8000 \\
    --users 1000 --spawn-rate 100 --run-time 30m \\
    --headless \\
    --html report.html \\
    --csv results

# Run distributed (master):
locust -f locustfile.py --master --expect-workers=4

# Run distributed (worker):
locust -f locustfile.py --worker --master-host=localhost
"""
