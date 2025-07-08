import requests
import json
import sys
from datetime import datetime

class PWATestSuite:
    def __init__(self, base_url="http://localhost:4173"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, test_func):
        """Run a single test"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            result = test_func()
            if result:
                self.tests_passed += 1
                print(f"✅ Passed - {name}")
            else:
                print(f"❌ Failed - {name}")
            return result
        except Exception as e:
            print(f"❌ Failed - {name} - Error: {str(e)}")
            return False

    def test_manifest_accessibility(self):
        """Test if the manifest file is accessible"""
        try:
            response = requests.get(f"{self.base_url}/manifest.webmanifest")
            if response.status_code != 200:
                print(f"  Manifest not accessible. Status code: {response.status_code}")
                return False
                
            # Parse the manifest content
            manifest = response.json()
            print(f"  Manifest content: {json.dumps(manifest, indent=2)}")
            
            # Check required fields
            required_fields = ["name", "short_name", "start_url", "icons"]
            missing_fields = [field for field in required_fields if field not in manifest]
            
            if missing_fields:
                print(f"  Missing required fields in manifest: {', '.join(missing_fields)}")
                return False
                
            # Check icons
            if not manifest.get("icons"):
                print("  No icons defined in manifest")
                return False
                
            # Check if at least one icon with size 192x192 and one with 512x512 exist
            icon_sizes = [icon.get("sizes") for icon in manifest.get("icons", [])]
            if "192x192" not in icon_sizes:
                print("  Missing 192x192 icon in manifest")
                return False
            if "512x512" not in icon_sizes:
                print("  Missing 512x512 icon in manifest")
                return False
                
            print("  Manifest is accessible and contains all required fields")
            return True
        except Exception as e:
            print(f"  Error checking manifest: {str(e)}")
            return False

    def test_icon_accessibility(self):
        """Test if the PWA icons are accessible"""
        try:
            # Test 192x192 icon
            response_192 = requests.get(f"{self.base_url}/pwa-192x192.png")
            if response_192.status_code != 200:
                print(f"  192x192 icon not accessible. Status code: {response_192.status_code}")
                return False
                
            # Test 512x512 icon
            response_512 = requests.get(f"{self.base_url}/pwa-512x512.png")
            if response_512.status_code != 200:
                print(f"  512x512 icon not accessible. Status code: {response_512.status_code}")
                return False
                
            print("  All PWA icons are accessible")
            return True
        except Exception as e:
            print(f"  Error checking icons: {str(e)}")
            return False

    def test_service_worker_file(self):
        """Test if the service worker file is accessible"""
        try:
            # Check for service worker file
            response = requests.get(f"{self.base_url}/sw.js")
            if response.status_code != 200:
                print(f"  Service worker file not accessible. Status code: {response.status_code}")
                return False
                
            print("  Service worker file is accessible")
            return True
        except Exception as e:
            print(f"  Error checking service worker: {str(e)}")
            return False

def main():
    # Setup
    tester = PWATestSuite("http://localhost:4173")
    
    # Run tests
    manifest_test = tester.run_test("Manifest Accessibility and Validation", tester.test_manifest_accessibility)
    icons_test = tester.run_test("PWA Icons Accessibility", tester.test_icon_accessibility)
    sw_test = tester.run_test("Service Worker File Accessibility", tester.test_service_worker_file)
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    # Return success only if all tests passed
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())