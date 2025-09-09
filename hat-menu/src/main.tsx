import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './styles/index.css';
import RecipesPage from './pages/RecipesPage.tsx';
import AddRecipePage from './pages/AddRecipePage.tsx';
import CreateMenuPage from './pages/CreateMenuPage.tsx';
import Navbar from './components/Navbar.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route index element={<RecipesPage />} />
                <Route path="add-recipe" element={<AddRecipePage />} />
                <Route path="create-menu" element={<CreateMenuPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
