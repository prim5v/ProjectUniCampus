import { Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SolutionsPage } from "./pages/SolutionsPage";
import { InfrastructurePage } from "./pages/InfrastructurePage";
import { StudentsPage } from "./pages/StudentsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { DesignPreview } from "./DesignPreview";

/** Public marketing routes. Registered for unauthenticated visitors only (see APP_TSX_PATCH.md). */
export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/solutions" element={<SolutionsPage />} />
    <Route path="/infrastructure" element={<InfrastructurePage />} />
    <Route path="/students" element={<StudentsPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    {import.meta.env.DEV && <Route path="/__design-preview" element={<DesignPreview />} />}
  </>
);
