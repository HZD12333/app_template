import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';

import ImagePage from '../pages/common/image-page';
import NotFoundPage from '../pages/common/not-found';

import { Guard } from './guard';
import { generateRoutes } from './utils';

const AppRoutes: React.FC = () => {
    const routes = generateRoutes();

    return (
        <HashRouter>
            <Routes>
                {routes.map((item, index) => (
                    <Route
                        path={item.path}
                        element={<Guard route={item} component={item.component} />}
                        key={index}
                    />
                ))}
                <Route key='image-page' path='/image-page' element={<ImagePage />} />
                <Route key='not-found' path='*' element={<NotFoundPage />} />
            </Routes>
        </HashRouter>
    );
};

export default AppRoutes;
