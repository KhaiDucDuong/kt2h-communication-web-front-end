import Activate from "@/components/Auth/Activate";
import { Suspense } from "react";

const ActivatePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Activate />
    </Suspense>
  );
};

export default ActivatePage;
