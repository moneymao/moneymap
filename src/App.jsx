import { RouterProvider } from "react-router-dom";

import router from "./router/route";
import PwaInstallPrompt from "./components/PwaInstallPrompt/PwaInstallPrompt";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <PwaInstallPrompt />
    </>
  );
};

export default App;