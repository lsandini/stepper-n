# stepper-n

This is a basic Expo SDK 51 project created using the blank template (no expo-router or Typescript)

Only react-native-health-connect was added as a dependency, and expo-health-connect as a plugin.

The App.js itself comes from :

https://github.com/matinzd/react-native-health-connect/blob/main/example/src/App.tsx

help me figure out why calling requestPermissions() results in an error:

```
kotlin.UninitializedPropertyAccessException: lateinit property requestPermission has not been initialized
  dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate.launch(HealthConnectPermissionDelegate.kt:32)
  dev.matinzd.healthconnect.HealthConnectManager$requestPermission$1$1.invokeSuspend(HealthConnectManager.kt:64)
  ...
```