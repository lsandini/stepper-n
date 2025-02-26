import * as React from "react";
import { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from "react-native";
import {
  aggregateRecord,
  getGrantedPermissions,
  initialize,
  insertRecords,
  getSdkStatus,
  readRecords,
  requestPermission,
  revokeAllPermissions,
  SdkAvailabilityStatus,
  openHealthConnectSettings,
  openHealthConnectDataManagement,
  readRecord,
} from "react-native-health-connect";

const getLastWeekDate = () => {
  return new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
};

const getLastTwoWeeksDate = () => {
  return new Date(new Date().getTime() - 2 * 7 * 24 * 60 * 60 * 1000);
};

const getTodayDate = () => {
  return new Date();
};

export default function App() {

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeHealthConnect();
  }, []);

  const initializeHealthConnect = async () => {
    try {
      await initialize();
      setIsInitialized(true);
      console.log('Health Connect initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Health Connect:', error);
    }
  };

  const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      console.log("SDK is available");
    }

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log("SDK is not available");
    }

    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log("SDK is not available, provider update required");
    }
  };

  const insertSampleData = () => {
    insertRecords([
      {
        recordType: "Steps",
        count: 1000,
        startTime: getLastWeekDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    ])
      .then((ids) => {
        console.log("Records inserted ", { ids });
      })
      .catch((err) => {
        console.error("Error inserting records ", { err });
      });
  };

  const readSampleData = () => {
    readRecords("Steps", {
      timeRangeFilter: {
        operator: "between",
        startTime: getLastTwoWeeksDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    })
      .then((result) => {
        console.log("Retrieved records: ", JSON.stringify({ result }, null, 2));
      })
      .catch((err) => {
        console.error("Error reading records ", { err });
      });
  };

  const readSampleDataSingle = () => {
    readRecord("Steps", "a7bdea65-86ce-4eb2-a9ef-a87e6a7d9df2")
      .then((result) => {
        console.log("Retrieved record: ", JSON.stringify({ result }, null, 2));
      })
      .catch((err) => {
        console.error("Error reading record ", { err });
      });
  };

  const aggregateSampleData = () => {
    aggregateRecord({
      recordType: "Steps",
      timeRangeFilter: {
        operator: "between",
        startTime: getLastWeekDate().toISOString(),
        endTime: getTodayDate().toISOString(),
      },
    }).then((result) => {
      console.log("Aggregated record: ", { result });
    });
  };

  const requestSamplePermissions = () => {
    requestPermission([
      {
        accessType: "read",
        recordType: "Steps",
      },
      {
        accessType: "write",
        recordType: "Steps",
      },
    ]).then((permissions) => {
      console.log("Granted permissions on request ", { permissions });
    });
  };

  const grantedPermissions = async () => {
    try {
      if (!isInitialized) {
        console.warn('Health Connect is not initialized yet');
        return;
      }
      const permissions = await getGrantedPermissions();
      console.log("Granted permissions ", { permissions });
    } catch (error) {
      console.error("Error getting granted permissions:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Initialize" onPress={initializeHealthConnect} />
      <Button
        title="Open Health Connect settings"
        onPress={openHealthConnectSettings}
      />
      <Button
        title="Open Health Connect data management"
        onPress={() => openHealthConnectDataManagement()}
      />
      <Button title="Check availability" onPress={checkAvailability} />
      <Button
        title="Request sample permissions"
        onPress={requestSamplePermissions}
      />
      <Button title="Get granted permissions" onPress={grantedPermissions} />
      <Button title="Revoke all permissions" onPress={revokeAllPermissions} />
      <Button title="Insert sample data" onPress={insertSampleData} />
      <Button title="Read sample data" onPress={readSampleData} />
      <Button title="Read specific data" onPress={readSampleDataSingle} />
      <Button title="Aggregate sample data" onPress={aggregateSampleData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 16,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});