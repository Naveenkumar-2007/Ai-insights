import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

print("="*60)
print("AI INSIGHTS - AZURE DEPLOYMENT")
print("="*60)
print(f"Python Version: {sys.version}")
print(f"Working Directory: {os.getcwd()}")
print(f"Python Path: {sys.path[:3]}")  # Show first 3 paths
print(f"Environment:")
print(f"  - PORT: {os.environ.get('PORT', '8000')}")
print(f"  - WEBSITES_PORT: {os.environ.get('WEBSITES_PORT', 'Not Set')}")
print(f"  - WEBSITE_SITE_NAME: {os.environ.get('WEBSITE_SITE_NAME', 'Not Set')}")
print("="*60)

try:
    # Import Flask app
    from app import application as app
    print("✅ Successfully imported Flask app from 'app.application'")
except ImportError as e:
    print(f"⚠️  Failed to import 'app.application': {e}")
    # Try alternative import
    try:
        from app import app
        print("✅ Successfully imported Flask app from 'app.app'")
    except ImportError as e2:
        print(f"❌ Both import methods failed: {e2}")
        raise

print(f"✅ App object: {app}")
print(f"✅ App name: {app.name}")
print("="*60)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
