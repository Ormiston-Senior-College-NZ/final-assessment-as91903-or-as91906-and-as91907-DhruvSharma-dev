import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import StudentInfo from "./pages/StudentInfo";
import Curriculum from "./pages/Curriculum";
import Careers from "./pages/Careers";
import WebApps from "./pages/WebApps";
import Expectations from "./pages/Expectations";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherPanel from "./pages/TeacherPanel";

function App() {
  return (
    <BrowserRouter>
      {/* These routes decide which page is shown for each URL. */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-info" element={<StudentInfo />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/web-apps" element={<WebApps />} />
        <Route path="/norms" element={<Expectations />} />
        <Route path="/expectations" element={<Expectations />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-panel" element={<TeacherPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
