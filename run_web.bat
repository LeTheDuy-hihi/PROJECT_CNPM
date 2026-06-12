@echo off
chcp 65001 >nul
echo =====================================================
echo KHOI DONG HE THONG QUAN LY SAN CAU LONG
echo =====================================================

cd /d "%~dp0"

IF NOT EXIST "QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\backend\node_modules\" (
    echo Dang cai dat thu vien cho Backend (chi lan dau tien)...
    cd "QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\backend"
    call npm install
    cd ..\..\..
)

IF NOT EXIST "QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\frontend\node_modules\" (
    echo Dang cai dat thu vien cho Frontend (chi lan dau tien)...
    cd "QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\frontend"
    call npm install
    cd ..\..\..
)

echo Dang khoi dong Backend...
start "Badminton Backend" cmd /k "cd ""QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\backend"" && npm run dev"

echo Dang khoi dong Frontend...
start "Badminton Frontend" cmd /k "cd ""QUAN_LY_SAN_CAU_LONG\HE_THONG)QUAN_LY\frontend"" && npm run dev"

echo.
echo He thong dang duoc khoi dong trong 2 cua so moi.
echo Vui long doi vai giay...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
echo =====================================================
echo Dang mo trinh duyet...
timeout /t 3 >nul
start http://localhost:5173
