import { useState } from 'react';

const useApprovalEvents = () => {
  const [approvalEvents, setApprovalEvents] = useState([]);

  const addApprovalEvent = (event) => {
    setApprovalEvents((prevEvents) => [...prevEvents, event]);
  };

  return {
    approvalEvents,
    addApprovalEvent,
  };
};

export default useApprovalEvents;
