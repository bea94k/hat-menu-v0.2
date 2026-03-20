import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './styles/index.css';
import RecipesPage from './pages/RecipesPage.tsx';
import AddRecipePage from './pages/AddRecipePage.tsx';
import MenusPage from './pages/MenusPage.tsx';
import CreateMenuPage from './pages/CreateMenuPage.tsx';
import AuthProvider from './auth/AuthProvider.tsx';
import ProtectedRoute from './auth/ProtectedRoute.tsx';
import PublicOnlyRoute from './auth/PublicOnlyRoute.tsx';
import SignInPage from './pages/SignInPage.tsx';
import EditRecipePage from './pages/EditRecipePage.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicOnlyRoute />}>
                        <Route path="sign-in" element={<SignInPage />} />
                    </Route>

                    <Route element={<ProtectedRoute />}>
                        <Route index element={<RecipesPage />} />
                        <Route path="add-recipe" element={<AddRecipePage />} />
                        <Route path="edit-recipe/:id" element={<EditRecipePage />} />
                        <Route path="menus" element={<MenusPage />} />
                        <Route path="create-menu" element={<CreateMenuPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
