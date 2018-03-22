build_ipa.sh

#!/bin/bash

cd ios

rm -rf build/*

# clean project 

xcodebuild clean -project DvaStarter.xcodeproj -configuration Release -alltargets

# make archive 

xcodebuild archive -project DvaStarter.xcodeproj -scheme DvaStarter -archivePath build/DvaStarter.xcarchive

# export .ipa

xcrun xcodebuild -exportArchive -archivePath build/DvaStarter.xcarchive -exportPath build -exportOptionsPlist exportPlist.plist

# notice: ��Ҫ�滻����MYAPPΪ�Լ���Ӧ������