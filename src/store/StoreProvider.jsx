'use client'
import { Provider } from 'react-redux';
import {makeStore}  from './store';
const StoreProvider = ({ children, initialReduxState }) => {
    const store = makeStore(initialReduxState);
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default StoreProvider;