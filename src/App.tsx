import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import HrServices from './pages/HrServices';
import RecruitmentManpower from './pages/RecruitmentManpower';
import RcuVerification from './pages/RcuVerification';
import PayrollServices from './pages/PayrollServices';
import NotFound from './pages/NotFound';
import ContactPage from './pages/Contact';
import About from './pages/AboutPage';
import ProjectOutsourcing from './pages/ProjectOutsourcing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Pages */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="/about-us" element={<About />} />

          {/* Services Pages */}
          <Route path="services">
            <Route path="hr-services" element={<HrServices />} />
            <Route path="recruitment-manpower" element={<RecruitmentManpower />} />
            <Route path="rcu-verification" element={<RcuVerification />} />
            <Route path="payroll" element={<PayrollServices />} />
            <Route path="project-outsourcing" element={<ProjectOutsourcing />} />
          </Route>

          {/* Legacy Redirects */}
          <Route path="hr-services" element={<HrServices />} />
          <Route path="recruitment-manpower" element={<RecruitmentManpower />} />
          <Route path="rcu-verification" element={<RcuVerification />} />
          <Route path="payroll" element={<PayrollServices />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;