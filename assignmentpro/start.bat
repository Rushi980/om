@echo off
title AssignmentPro - Smart College Assignment Generator
cd /d "%~dp0"
echo ========================================================
echo    AssignmentPro - Smart College Assignment Generator
echo ========================================================
echo.
echo Launching AssignmentPro Web Application...

:: Detect Python executable
set "PYTHON_EXE="
if exist "%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe" (
    set "PYTHON_EXE=%LOCALAPPDATA%\Python\pythoncore-3.14-64\python.exe"
) else (
    where python >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "PYTHON_EXE=python"
    ) else (
        where py >nul 2>nul
        if %ERRORLEVEL% equ 0 (
            set "PYTHON_EXE=py"
        )
    )
)

if "%PYTHON_EXE%"=="" (
    echo [ERROR] Python was not found on your system.
    echo Please install Python 3.10+ or check your PATH.
    pause
    exit /b 1
)

echo Using Python: %PYTHON_EXE%
"%PYTHON_EXE%" run.py
pause
