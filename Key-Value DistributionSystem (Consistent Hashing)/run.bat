@echo off
REM run.bat - Script to start and stop the Distributed Hashing project components on Windows

REM Define ports for servers and client
SET SERVER_PORT_1=9001
SET SERVER_PORT_2=9002
SET SERVER_PORT_3=9003
SET CLIENT_PORT=9004

REM --- Function to start all components ---
:start_all
    echo --- Ensuring Go modules are tidy ---
    go mod tidy

    echo --- Starting Server Node 1 on port %SERVER_PORT_1% ---
    start /b cmd /c "go run server/main.go %SERVER_PORT_1%"
    echo %!PID! > server1.pid

    echo --- Starting Server Node 2 on port %SERVER_PORT_2% ---
    start /b cmd /c "go run server/main.go %SERVER_PORT_2%"
    echo %!PID! > server2.pid

    echo --- Starting Server Node 3 on port %SERVER_PORT_3% ---
    start /b cmd /c "go run server/main.go %SERVER_PORT_3%"
    echo %!PID! > server3.pid

    echo --- Waiting a moment for servers to start... ---
    timeout /t 2 /nobreak > NUL

    echo --- Starting Client on port %CLIENT_PORT% (will run tests) ---
    go run client/main.go %CLIENT_PORT%
    goto :eof

REM --- Function to clean up (stop processes) ---
:clean
    echo --- Cleaning up running processes ---
    REM Terminate server processes using their PIDs
    IF EXIST server1.pid (
        FOR /F %%i IN (server1.pid) DO (
            taskkill /PID %%i /F > NUL 2>&1
        )
        DEL server1.pid
    )
    IF EXIST server2.pid (
        FOR /F %%i IN (server2.pid) DO (
            taskkill /PID %%i /F > NUL 2>&1
        )
        DEL server2.pid
    )
    IF EXIST server3.pid (
        FOR /F %%i IN (server3.pid) DO (
            taskkill /PID %%i /F > NUL 2>&1
        )
        DEL server3.pid
    )

    REM Attempt to kill client process (it usually exits after tests)
    taskkill /IM go.exe /F /FI "WINDOWTITLE eq go run client/main.go %CLIENT_PORT%" > NUL 2>&1
    taskkill /IM go.exe /F /FI "COMMANDLINE eq *client\main.go %CLIENT_PORT%*" > NUL 2>&1

    echo --- Processes stopped and PID files removed ---
    goto :eof

REM --- Main script logic ---
IF "%1"=="start" GOTO start_all
IF "%1"=="clean" GOTO clean
IF "%1"=="start_all" GOTO start_all REM For compatibility with make target name
IF "%1"=="run-all" GOTO start_all REM For compatibility with make target name

echo.
echo Usage: run.bat [start/clean]
echo.
echo   start   - Starts all server nodes and then the client.
echo   clean   - Stops all running server and client processes.
echo.
