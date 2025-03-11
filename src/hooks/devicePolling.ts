import { useEffect } from 'react';
import useDeviceStore from '../stores/deviceStore';
import { debounce } from '../utils/debounce';

const useDevicePolling = () => {
  const { devices, fetchDeviceStatus } = useDeviceStore();

  const fetchStatuses = debounce(async () => {
    const deviceIPs = Object.keys(devices);
    if (deviceIPs.length === 0) return;

    await Promise.all(
      deviceIPs.map(async (deviceIP) => {
        try {
          const success = await fetchDeviceStatus(deviceIP);
          console.log(`Fetched ${deviceIP} status at:`, new Date().toISOString());
          // if (success) {
          // }
        } catch (error) {
          console.error(`Failed to fetch ${deviceIP} status:`, error);
        }
      })
    );
  }, 1000); // 1s debounce—prevents rapid calls

  useEffect(() => {
    fetchStatuses();

    const interval = setInterval(() => {
      fetchStatuses();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

export default useDevicePolling;