@echo off
echo ========================================
echo  BITS Mess Review - Backend Server
echo ========================================
echo.
echo Starting Spring Boot application...
echo Backend will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
mvnw.cmd spring-boot:run
