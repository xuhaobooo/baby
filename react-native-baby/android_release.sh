build_apk.sh
#!/bin/bash
rm android/app/build/outputs/app-release.apk
cd android
./gradlew assembleRelease