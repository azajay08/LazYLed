import { useEffect, useState } from 'react';
import useDeviceStore from '../stores/deviceStore';
import { debounce } from '../utils/debounce';

const useDevicePolling = () => {
  const { devices, fetchDeviceStatus } = useDeviceStore();
  const [isDeviceAdded, setIsDeviceAdded] = useState(false);

  const fetchStatuses = debounce(async () => {
    const deviceIPs = Object.keys(devices);
    if (deviceIPs.length === 0) return;

    await Promise.all(
      deviceIPs.map(async (deviceIP) => {
        try {
          const success = await fetchDeviceStatus(deviceIP);
          console.log(`Fetched ${deviceIP} status at:`, new Date().toISOString());
        } catch (error) {
          console.error(`Failed to fetch ${deviceIP} status:`, error);
        }
      })
    );
  }, 1000); // 1s debounce—prevents rapid calls

  // Handle device addition process
  useEffect(() => {
    if (!isDeviceAdded) {
      fetchStatuses();
      setIsDeviceAdded(true);
    }

    const interval = setInterval(() => {
      console.log('Running fetchStatuses at:', new Date().toISOString());
      fetchStatuses();
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [devices, isDeviceAdded]);

  useEffect(() => {
    if (Object.keys(devices).length > 0 && !isDeviceAdded) {
      setIsDeviceAdded(true);
    }
  }, [devices]);

};

export default useDevicePolling;
