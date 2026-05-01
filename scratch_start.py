import subprocess
import os
import time

spark_dir = r"C:\Users\Yeyian PC\OneDrive\Desktop\spark"

def launch_detached(cmd, name):
    print(f"Launching {name}...")
    subprocess.Popen(cmd, cwd=spark_dir, shell=True, creationflags=subprocess.CREATE_NEW_CONSOLE)

launch_detached("python local_magic_server.py", "Magic Brain")
launch_detached("node server.cjs", "Magic Proxy")
launch_detached("npm run dev", "Spark Frontend")

print("All servers launched in separate consoles.")
