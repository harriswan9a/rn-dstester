# DSTester

[![](https://raw.githubusercontent.com/harriswan9a/rn-dstester/master/screenshots/ezgif.com-optimize.gif)](https://github.com/harriswan9a/rn-dstester)

### 版本

|項目|版本|確認版號|
|-----|-----|-----|
|nodejs|6.9.5|`node -v`|
|nvm|0.33.0|`nvm --version`|
|npm|3.10.10|`npm -v`|
|react-native|0.47.1|`react-native -v`|
|react-native-cli|2.0.1|`react-native -v`|
|rnpm|1.9.0|`rnpm --version`|
|xcode|8.3.3|`xcodebuild -version`|
|android studio|Preview 3.0 Canary 9|About Android Studio|
|android sdk|23.0.1|android/app/build.gradle `buildToolsVersion`|
|java jdk| 1.8.0_121|`java -version`|


### Library
|項目|版本|說明|
|-----|-----|-----|
|react-native-tcp|^3.2.2|replace net native module|
|tcp-ping|^0.1.1|ICMI ping|



- Install [rnpm](https://github.com/rnpm/rnpm)

```bash
npm install rnpm -g
```

#### Run Debug

- Android

    ```bash
    react-native run-android
    ```

- iOS

    ```bash
    react-native run-ios
    ```

#### Run Release

- Android
    
    ```bash
    react-native run-android --variant=release
    ```
    
    ##### Fix Error
    
    1. Check if `android/app/src/main/assets` is exist, or make it.
    2. Check release candidates(keystore)
        1. Create keystore file
            - Use Android Studio open from android folder.
            - Build > Generate Signed APK... > Create New...
            - Key store path: {android_project_root}/keystores/release.keystore
        2. Add into `android/app/build.gradle` file
        ```gradle
        android {
            //...
            signingConfigs {
                    release {
                        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                            storeFile file(project.rootDir.absolutePath + MYAPP_RELEASE_STORE_FILE)
                            storePassword MYAPP_RELEASE_STORE_PASSWORD
                            keyAlias MYAPP_RELEASE_KEY_ALIAS
                            keyPassword MYAPP_RELEASE_KEY_PASSWORD
                        } else {
                            println 'release keystore file not found.'
                        }
                    }
            }
            buildTypes {
                    release {
                        //...
                        signingConfig signingConfigs.release
                    }
            }
        }
        ```
        
        2. Add into `android/gradle.properties` file
        ```gradle
        MYAPP_RELEASE_STORE_FILE=/keystores/release.keystore
        MYAPP_RELEASE_STORE_PASSWORD={store_password}
        MYAPP_RELEASE_KEY_ALIAS={key_alias}
        MYAPP_RELEASE_KEY_PASSWORD={key_password}
        ```

- iOS

    ```
    react-native run-ios --device "ShihMin's iPhone" --configuration Release
    ```
    
    - Fix Error

        1. Can not install distribution's ipa to device, use XCode run error 「Check dependencies」.
        ```
        Check dependencies
        --------------------------------------------------------
        Signing for "DSTesterTests" requires a development team. Select a development team in the project editor.
        Code signing is required for product type 'Unit Test Bundle' in SDK 'iOS 10.3'
        Signing for "DSTesterTests" requires a development team. Select a development team in the project editor.
        Code signing is required for product type 'Unit Test Bundle' in SDK 'iOS 10.3'
        Signing for "DSTesterTests" requires a development team. Select a development team in the project editor.
        Code signing is required for product type 'Unit Test Bundle' in SDK 'iOS 10.3'
        Signing for "DSTesterTests" requires a development team. Select a development team in the project editor.
        Code signing is required for product type 'Unit Test Bundle' in SDK 'iOS 10.3'
        ```
        
        Solution：
            Check if test target's certificate is correct.


### 開發遇到的問題

1. 找到 `tcp-ping@0.1.1` library 可以 ping , 但它內部引用的 node 原生 module `net`, React Native 是不支援的無法使用。  
   Sol：改使用 `react-native-tcp` 替換掉原本的 net 引用。但必須手動修正幾個Bug...  
    1. 將 `tcp-ping` 移出 node_modules
    2. 在主專案引用 `react-native-tcp`
    ```sh
    npm install react-native-tcp --save
    react-native link react-native-tcp
    # issue:#57 Address createJSModules being removed in RN 0.47
    # Android 需刪除 TcpSocketsModule#createJSModules() 的 @Override 註釋, Deprecated RN 0.47
    # issue:#59 Set callback after write can cause callback being skipped
    ```
    3. package.json add browser, 編譯自動將 net 替換成 react-native-tcp
    ```json
    {
       "browser": {
           "net": "react-native-tcp"
       }
    }
    ```
    
    4.將 `tcp-ping` ping.js require('net') 改引用 `react-native-tcp` 替代。  
    
    5. 解決了原生 net module 問題接著要處理 `process.hrtime()`, 同樣在 react-native 無法使用。  
        Sol：找了替代 module `browser-process-hrtime` 取代, 直接在 tcp-ping module 裡面 npm install browser-process-hrtime --save, 並將相關語法替換掉。

    


### TODO
   
   1. 將 node_module/react-native-tcp 移到 libs/react-native-tcp, 因為PR有修正依些問題作者還未合併發布。
    