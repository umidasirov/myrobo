import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import root from "./router/index.jsx";
import { DataProvider } from "./datacontect/index.jsx";
// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
// });
// document.addEventListener("keydown", (e) => {
//   if (
//     e.key === "F12" ||
//     (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
//     (e.ctrlKey && e.key === "U")
//   ) {
//     e.preventDefault();
//   }
// });
// setInterval(() => {
//   const devtoolsOpen =
//     window.outerWidth - window.innerWidth > 100 ||
//     window.outerHeight - window.innerHeight > 100;

//   if (devtoolsOpen) {
//     document.body.innerHTML = "DevTools yoping! va refresh qiling ";
//   }
// }, 1000);
createRoot(document.getElementById("root")).render(
    <DataProvider>
      <RouterProvider router={root} />
    </DataProvider>
);
