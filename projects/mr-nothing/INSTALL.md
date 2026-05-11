# Install MR NOTHING

## Requirements
- JDK 17
- Android SDK
- Gradle
- ADB
- Docker (optional for backend)

## Android Build
```bash
cd projects/mr-nothing/apps/mobile-agent
chmod +x gradlew
gradle assembleDebug
```

## Install APK
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Permissions
Enable:
- microphone
- notifications
- foreground services

## Backend
```bash
cd projects/mr-nothing/services/api-core
docker build -t mrnothing-api .
docker run -p 8000:8000 mrnothing-api
```
