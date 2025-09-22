import React from "react";
import MainPage from "./pages/MainPage/MainPage";
import "./App.css";

// App은 오직 화면 구성만 담당합니다. (렌더링/Provider는 main.tsx에서 처리)
function App() {
  return <MainPage />;
}

export default App;
