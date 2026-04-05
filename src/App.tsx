import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import Webinars from "./pages/Webinars";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Resources from "./pages/Resources";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import AdminJobs from "./pages/AdminJobs";
import AdminScholarships from "./pages/AdminScholarships";
import AdminInternships from "./pages/AdminInternships";
import AdminWebinars from "./pages/AdminWebinars";
import AdminCourses from "./pages/AdminCourses";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminBlog from "./pages/AdminBlog";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminAds from "./pages/AdminAds";
import SavedOpportunities from "./pages/SavedOpportunities";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Submit from "./pages/Submit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/internships/:id" element={<InternshipDetail />} />
          <Route path="/webinars" element={<Webinars />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/scholarships" element={<AdminScholarships />} />
          <Route path="/admin/internships" element={<AdminInternships />} />
          <Route path="/admin/webinars" element={<AdminWebinars />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/subscribers" element={<AdminSubscribers />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved" element={<SavedOpportunities />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
