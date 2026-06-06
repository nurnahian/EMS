import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => (
  <Toaster
    position="bottom-right"
    reverseOrder={true}
    richColors
    closeButton
    duration={4000}
    toastOptions={{
      success: {
        style: { background: "#1ba802", color: "white", borderRadius: "12px" },
      },
      error: {
        style: { background: "#ef4444", color: "white", borderRadius: "12px" },
      },
    }}
  />
);

//   <Toaster
//     position="bottom-right"
//     richColors
//     closeButton
//     duration={4000}
//     toastOptions={{
//       success: {
//         style: {
//           background: "#1ba802",
//           color: "white",
//         },
//       },
//       error: {
//         style: {
//           background: "#ef4444",
//           color: "white",
//         },
//       },
//     }}
//   />
