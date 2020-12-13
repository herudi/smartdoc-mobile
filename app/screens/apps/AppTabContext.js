import React from 'react'

const AppTabContext = React.createContext(null);

export const AppTabProvider = AppTabContext.Provider;
export const AppTabConsumer = AppTabContext.Consumer;

export default AppTabContext;