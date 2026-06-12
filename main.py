import os
import subprocess
import time
import webbrowser

def main():
    print("=====================================================")
    print("[*] KHOI DONG HE THONG QUAN LY SAN CAU LONG")
    print("=====================================================")
    
    backend_dir = os.path.join("QUAN_LY_SAN_CAU_LONG", "HE_THONG)QUAN_LY", "backend")
    frontend_dir = os.path.join("QUAN_LY_SAN_CAU_LONG", "HE_THONG)QUAN_LY", "frontend")
    
    if not os.path.exists(backend_dir) or not os.path.exists(frontend_dir):
        print(f"[!] Khong tim thay thu muc backend hoac frontend.")
        print("Vui long kiem tra lai cau truc thu muc!")
        return

    # Kiem tra va cai dat npm packages cho backend
    if not os.path.exists(os.path.join(backend_dir, "node_modules")):
        print("-> Dang cai dat thu vien cho Backend (chi lan dau tien)...")
        subprocess.run("npm install", cwd=backend_dir, shell=True)

    # Kiem tra va cai dat npm packages cho frontend
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        print("-> Dang cai dat thu vien cho Frontend (chi lan dau tien)...")
        subprocess.run("npm install", cwd=frontend_dir, shell=True)

    print("-> Dang khoi dong Backend (Cong 3000)...")
    subprocess.Popen('start "Badminton Backend" cmd /k "npm run dev"', cwd=backend_dir, shell=True)

    print("-> Dang khoi dong Frontend (Cong 5173)...")
    subprocess.Popen('start "Badminton Frontend" cmd /k "npm run dev"', cwd=frontend_dir, shell=True)
    
    print("=====================================================")
    print("[+] He thong dang duoc khoi dong!")
    print("Vui long doi vai giay, trinh duyet se tu dong mo trang web...")
    print(" - Frontend: http://localhost:5173")
    print(" - Backend API: http://localhost:3000")
    print("=====================================================")
    
    time.sleep(8)
    webbrowser.open("http://localhost:5173")

if __name__ == "__main__":
    main()
