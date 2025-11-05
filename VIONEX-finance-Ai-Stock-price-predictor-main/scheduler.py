"""
Automatic Model Training Scheduler
Runs model training every hour in the background
"""

import schedule
import time
import threading
import logging
from datetime import datetime
from model_trainer import train_popular_stocks

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('Scheduler')


class ModelTrainingScheduler:
    """Schedules automatic model training"""
    
    def __init__(self):
        self.is_running = False
        self.thread = None
        self.last_training_time = None
        self.training_results = []
    
    def train_models_job(self):
        """Job that runs model training"""
        try:
            logger.info("⏰ Starting scheduled model training...")
            self.last_training_time = datetime.now()
            
            # Run training
            results = train_popular_stocks()
            
            if results:
                self.training_results.append({
                    'timestamp': self.last_training_time.isoformat(),
                    'results': results
                })
                
                # Keep only last 24 training results
                if len(self.training_results) > 24:
                    self.training_results = self.training_results[-24:]
                
                logger.info(f"✅ Scheduled training completed: {results['total_models']} models trained")
                logger.info(f"   Average R²: {results['average_r2']:.4f}")
                logger.info(f"   Average MAE: {results['average_mae']:.4f}")
            else:
                logger.warning("⚠️ Training completed but no results returned")
                
        except Exception as e:
            logger.error(f"❌ Error in scheduled training: {e}")
    
    def run_scheduler(self):
        """Run the scheduler loop"""
        logger.info("🚀 Model training scheduler started")
        logger.info("📅 Training will run every hour")
        
        # Run immediately on startup
        logger.info("🎯 Running initial training...")
        self.train_models_job()
        
        # Schedule for every hour
        schedule.every(1).hours.do(self.train_models_job)
        
        while self.is_running:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
        
        logger.info("🛑 Scheduler stopped")
    
    def start(self):
        """Start the scheduler in a background thread"""
        if self.is_running:
            logger.warning("⚠️ Scheduler already running")
            return
        
        self.is_running = True
        self.thread = threading.Thread(target=self.run_scheduler, daemon=True)
        self.thread.start()
        logger.info("✅ Scheduler thread started")
    
    def stop(self):
        """Stop the scheduler"""
        self.is_running = False
        if self.thread:
            self.thread.join(timeout=5)
        logger.info("🛑 Scheduler stopped")
    
    def get_status(self):
        """Get scheduler status"""
        return {
            'is_running': self.is_running,
            'last_training': self.last_training_time.isoformat() if self.last_training_time else None,
            'next_training': self._get_next_training_time(),
            'training_history': self.training_results[-5:] if self.training_results else []
        }
    
    def _get_next_training_time(self):
        """Calculate next training time"""
        if not self.last_training_time:
            return "Will run immediately on start"
        
        from datetime import timedelta
        next_time = self.last_training_time + timedelta(hours=1)
        return next_time.isoformat()


# Global scheduler instance
scheduler = ModelTrainingScheduler()


if __name__ == '__main__':
    # Test scheduler
    logger.info("Testing scheduler...")
    scheduler.start()
    
    try:
        # Keep running
        while True:
            time.sleep(10)
            status = scheduler.get_status()
            logger.info(f"Status: {status}")
    except KeyboardInterrupt:
        logger.info("Stopping scheduler...")
        scheduler.stop()
