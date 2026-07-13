import psycopg2
from psycopg2.extras import Json
import uuid
import datetime

DATABASE_URL = "postgresql://postgres.puoxvrrnqpswuhtsgmxk:8hDQW97c%26%2Av%254o@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"

def get_id():
    return "port_" + str(uuid.uuid4())[:18]

def get_cat_id():
    return "pcat_" + str(uuid.uuid4())[:18]

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    hw_id = get_cat_id()
    auto_id = get_cat_id()
    
    # Insert categories
    cur.execute("""
        INSERT INTO portfolio_category (id, name, created_at, updated_at) 
        VALUES (%s, %s, %s, %s)
    """, (hw_id, "Hardware", datetime.datetime.now(), datetime.datetime.now()))
    
    cur.execute("""
        INSERT INTO portfolio_category (id, name, created_at, updated_at) 
        VALUES (%s, %s, %s, %s)
    """, (auto_id, "Automation", datetime.datetime.now(), datetime.datetime.now()))

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
        cur.execute("""
            INSERT INTO portfolio (id, title, category_id, icon, gradient, overview, specs, images, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            get_id(), 
            p["title"], 
            p["category_id"], 
            p["icon"], 
            p["gradient"], 
            p["overview"], 
            Json(p["specs"]), 
            Json(p["images"]),
            datetime.datetime.now(),
            datetime.datetime.now()
        ))

    conn.commit()
    print("Mock data inserted successfully via SQL!")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'cur' in locals():
        cur.close()
    if 'conn' in locals():
        conn.close()
