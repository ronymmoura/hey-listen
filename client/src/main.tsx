import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

import { RootLayout } from "./pages";
import { HomePage } from "./pages/home";
import { StudioPage } from "./pages/studio";
import { MusicPage } from "./pages/music";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/music/:yt_id" element={<MusicPage />} />
        <Route path="/studio" element={<StudioPage />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
