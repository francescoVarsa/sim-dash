import { useCallback, useEffect, useState } from "react";

export const useConnection = () => {
  const [status, setStatus] = useState<"loading" | "failed" | "connected">(
    "loading"
  );
  const [remoteHostIp, setRemoteHostIp] = useState<string>();

  const searchBackendOnNet = useCallback(async () => {
    setStatus("loading");
    try {
      const remoteHostAddress = await (window as any).myAPI.connectService();
      setRemoteHostIp(remoteHostAddress);
      setStatus("connected");
    } catch (error) {
      console.log(error);
      setStatus("failed");
    }
  }, []);

  const fetchData = useCallback(async () => {
    const message = {
      from: "Francesco",
      to: "Matteo",
      amount: 3.5,
      remoteHost: remoteHostIp,
    };

    return await (window as any).myAPI.getACCData(message);
  }, [remoteHostIp]);

  useEffect(() => {
    searchBackendOnNet();
  }, [searchBackendOnNet]);

  return { status, fetchData };
};
