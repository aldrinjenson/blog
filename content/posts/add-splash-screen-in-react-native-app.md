---
title: "Easiest way to add a splash screen in a React Native App"
date: 2020-06-24T00:58:27+05:30
draft: false
tags: ["tech"]
---

> Note: This article was initially written in [Medium](https://medium.com/swlh/the-easiest-way-to-add-a-splash-screen-to-your-react-native-app-2d36bee3117b)

Hi, this article is a result of me spending a hell lot of time to figure out the best and easiest way to solve the above problem of adding a splash screen to a React-native app. Almost all the tutorials available as of when this post is being written (2020 June) have at least some part of the code outdated and so if you are someone like me who is real lazy and tries to copy-paste all the code mentioned in them, your gradle config will break some way or the other and its total frustration.

> Note: If you are building your app using the awesome expo-cli, then you don’t need to go through the below tutorial, adding a splash screen to an expo app is as simple as replacing the default splash image in assets folder with your own custom image and then renaming it as ‘splash.png’.

Now, for those of us who have built the app with the good-old react-native init, adding a splash screen consists of the following 4 steps:

## Step 1: Get the splash image ready!

I know, this is a no-brainier. But hey, do you exactly have the splash image in 6 different dimensions? Yes? Then please carry on to the next step. No? Well guess what, you actually do need the same image in 6 dimensions! So how will you manage to make-do with just one image if that’s all what you got?

Don’t bother going to Photoshop and resizing, here’s an awesome tool I found to make the process of splash image generation a piece of cake.

Just go to [this](https://apetools.webprofusion.com/#/tools/imagegorilla) site, add your one splash image(preferably with the highest quality you could manage), choose the required platform(andoid and/or ios) and punch the Kapow button). The tool will generate a zip file of the splash screen in various different pixel dimensions.

Extract it and copy all the contents in the android/or ios folder from the bundle to your android/app/src/main/res folder.
Step 1: Install the super cool npm package: react-native-splash-screen

This will make the whole process dead simple

```bash
npm i react-native-splash-screen
```

or using yarn,

```bash
yarn add react-native-splash-screen
```

> Note: if your react-native cli version is below 0.6, don’t forget to link the above package using: `react-native link react-native-splash-screen`

## Step 2: Configuration

### Android:

You have got to update the MainActivity.java file (located at `android/app/src/main/java/com/your_project_name` folder) in order to use react-native-splash-screen in your project. Just make changes to the file like given below:

```java
import android.os.Bundle;import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;public class MainActivity extends ReactActivity {
  @Override protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);
  }
// ...other code
}
```

Now, create a file called launch_screen.xml in app/src/main/res/layout (create the layout folder if it doesn't exist). The contents of the file should be the following:

```xml

<?xml version="1.0" encoding="utf-8"?>

<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"android:orientation="vertical" android:layout_width="match_parent"
android:layout_height="match_parent">
  <ImageView
  android:layout_width="match_parent"                      android:layout_height="match_parent"
  android:src="@drawable/screen"
  android:scaleType="centerCrop" />
</RelativeLayout>
```

Now we have got to add a color called primary_dark in app/src/main/res/values/colors.xml(create if it doesn't exist already)by pasting in the following code:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary_dark">#000000</color>
</resources>
```

### iOS:

Update AppDelegate.m (located at ios/splashapp) with the following additions:

```swift
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"
@implementation AppDelegate- (BOOL)application:(UIApplication _)application didFinishLaunchingWithOptions:(NSDictionary _)launchOptions{
  // ...other code
  [RNSplashScreen show]; // or//[RNSplashScreen showSplash:@"LaunchScreen" inRootView:rootView];
  return YES;
  }@end
```

## Step 3: Hiding the splash and loading your main-screen

By now, if you run your app, you would be able to see the splash image cover the entire screen(like it should) and showing forever(like it shouldn’t). Basically it would never close, and there is even a chance of your app crashing after a few seconds of the image showing like this.

Now, when should the splash screen be closed? Maybe when the main entry file of your app is executed? Yes! So let’s just modify App.js so that exactly when the project files would finish loading and is ready to be executed, the splash screen would give way to your main/primary screen.

```javascript
// make following changes to App.js
import SplashScreen from "react-native-splash-screen";
export default class App extends Component {
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash
    // screen
    SplashScreen.hide();
  }
}
```

In case you are using functional components, just call SplashScreen.hide() inside a useEffect hook with an empty dependency array.

---

And, there you go my friends, that’s all there is to it.

If the above solution for some reason didn’t work for you, or if you want to add some advanced effects in your splash screen like customizing the color of the status bar when loading etc, here are the references I used. However, do keep in mind that all software related guides(including this one) tend to get outdated as new features get added to the various packages used and some breaking change occurs. That being said, all the best to your project. Cheers ✨

- https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae
- https://www.npmjs.com/package/react-native-splash-screen
- https://www.netguru.com/blog/react-native-splash-screen
