# Navigate to the backend directory and start the npm server in a new PowerShell window
Set-Location backend
Start-Process -FilePath "pwsh.exe" -ArgumentList "-NoExit", "-Command", "npm start"

# Navigate to the frontend directory and start the npm development server in a new PowerShell window
Set-Location ..\frontend
Start-Process -FilePath "pwsh.exe" -ArgumentList "-NoExit", "-Command", "npm run dev"

Set-Location ..