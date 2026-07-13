import requests

API_URL = "http://localhost:3738"

# 1. Create categories
hardware_cat = requests.post(f"{API_URL}/admin/portfolio-categories", json={"name": "Hardware"}).json()
automation_cat = requests.post(f"{API_URL}/admin/portfolio-categories", json={"name": "Automation"}).json()

hw_id = hardware_cat.get("portfolio_category", {}).get("id")
auto_id = automation_cat.get("portfolio_category", {}).get("id")

print(f"Categories created: HW={hw_id}, Auto={auto_id}")

# 2. Create portfolios
portfolios = [
    {
      "title": "Advanced Industrial PCB",
      "category_id": hw_id,
      "icon": "Cpu",
      "gradient": "bg-gradient-to-br from-emerald-600 to-teal-900",
      "overview": "A highly complex, multi-layer printed circuit board designed for real-time robotic control systems. Features advanced thermal management, high-speed signal integrity, and ultra-low latency processing.",
      "specs": ["12-Layer Board", "Real-time Processing", "Thermal Management"],
      "images": ["http://localhost:3738/static/mock_portfolio_1.jpg"]
    },
    {
      "title": "Precision Robotic Arm",
      "category_id": auto_id,
      "icon": "Wrench",
      "gradient": "bg-gradient-to-br from-zinc-800 to-zinc-950",
      "overview": "An industrial-grade autonomous robotic arm built for precision manufacturing. It leverages computer vision and machine learning for predictive path planning.",
      "specs": ["0.01mm Precision", "Computer Vision Integration", "Carbon Fiber Frame"],
      "images": ["http://localhost:3738/static/mock_portfolio_2.jpg"]
    },
    {
      "title": "Autonomous Inspection Drone",
      "category_id": auto_id,
      "icon": "Plane",
      "gradient": "bg-gradient-to-br from-blue-600 to-indigo-900",
      "overview": "A specialized quadcopter drone engineered for autonomous industrial inspections. Features LiDAR, thermal imaging, and a reinforced carbon-fiber exoskeleton.",
      "specs": ["LiDAR Mapping", "Thermal Imaging", "45-min Flight Time"],
      "images": ["http://localhost:3738/static/mock_portfolio_3.jpg"]
    }
]

for p in portfolios:
    res = requests.post(f"{API_URL}/admin/portfolios", json=p)
    print(res.json())

print("Seeded via HTTP!")
