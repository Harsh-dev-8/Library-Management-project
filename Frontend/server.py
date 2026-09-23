import subprocess
import time
print("Server starting at port:5500")

time.sleep(1.5)

result = subprocess.run(["python", "-m", "http.server", "5500"])
print(result.stdout)
