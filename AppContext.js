import React from 'react'

const AppContext = React.createContext(null);

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

export default AppContext;