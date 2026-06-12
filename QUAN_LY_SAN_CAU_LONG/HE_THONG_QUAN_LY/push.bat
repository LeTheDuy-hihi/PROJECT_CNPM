@echo off
echo ===================================================
echo CHUAN BI PUSH CODE LEN GITHUB
echo ===================================================
echo.
echo Kiem tra va khoi tao Git...
git init
git add .
git commit -m "Initial commit - Do an quan ly san cau long"
git branch -M main
git remote add origin https://github.com/LeTheDuy-hihi/PROJECT_CNPM.git
echo.
echo ===================================================
echo DANG PUSH CODE...
echo *Luu y: Neu co cua so bat len yeu cau dang nhap GitHub, ban hay chon "Sign in with your browser" nhe!
echo ===================================================
git push -u origin main --force
echo.
echo HOAN THANH! Ban co the kiem tra tren trang GitHub.
pause
